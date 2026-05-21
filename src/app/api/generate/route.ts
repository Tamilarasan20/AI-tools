import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';
import { buildPrompt, ToolType } from '@/lib/prompts';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MAX_INPUT_LENGTH = 2000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tool, inputs } = body as { tool: ToolType; inputs: Record<string, string> };

    if (!tool || !inputs) {
      return new Response(JSON.stringify({ error: 'Missing tool or inputs' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Basic input sanitization — prevent oversized inputs
    const sanitizedInputs: Record<string, string> = {};
    for (const [key, value] of Object.entries(inputs)) {
      if (typeof value === 'string') {
        sanitizedInputs[key] = value.slice(0, MAX_INPUT_LENGTH);
      }
    }

    const prompt = buildPrompt(tool, sanitizedInputs);

    const stream = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 3500,
      stream: true,
      messages: [{ role: 'user', content: prompt }],
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(new TextEncoder().encode(event.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Generation error:', error);
    return new Response(JSON.stringify({ error: 'Generation failed. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
