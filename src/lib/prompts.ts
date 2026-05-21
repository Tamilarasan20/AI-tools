export type ToolType =
  | 'brand-voice'
  | 'social-calendar'
  | 'content-pillars'
  | 'hook-generator'
  | 'ad-copy'
  | 'marketing-strategy'
  | 'landing-page-copy'
  | 'product-description'
  | 'competitor-audit';

export function buildPrompt(tool: ToolType, inputs: Record<string, string>): string {
  switch (tool) {
    case 'brand-voice':
      return `You are a world-class brand strategist. Create a comprehensive, specific brand voice guide based on this business.

Business Name: ${inputs.businessName}
What They Sell: ${inputs.description}
Target Audience: ${inputs.audience}
Brand Personality Words: ${inputs.personality}
Brands They Admire: ${inputs.admiredBrands || 'Not specified'}
Primary Platform: ${inputs.platform}

Generate a Brand Voice Guide with EXACTLY these sections:

## Brand Personality
List 4-5 key personality traits with a 1-sentence explanation of each. Be specific to this business.

## Tone of Voice
Describe exactly how this brand should sound in 4-6 sentences. Include specific characteristics — formal vs casual, serious vs playful, etc.

## Words to Use (15 examples)
List 15 specific words and phrases that perfectly fit this brand. Include a short note on why each fits.

## Words to Avoid (10 examples)
List 10 words/phrases that clash with this brand and would feel off. Include why.

## Example Captions (3 examples)
Write 3 platform-native captions for ${inputs.platform} they could post TODAY. Make them real and ready to publish — not templates.

## Example Ad Copy (2 examples)
Write 2 short ad copy examples (Hook + 2-3 sentences + CTA). Make them specific to what they sell.

## Content Pillars (5 pillars)
List 5 content themes. For each:
- Pillar name and description
- Why it resonates with their audience
- 3 specific post ideas

Be direct, specific, and make every line useful. Avoid generic marketing advice.`;

    case 'social-calendar':
      return `You are a social media strategist. Create a complete 30-day content calendar for this business.

Business Type: ${inputs.businessType}
Target Audience: ${inputs.audience}
Goal: ${inputs.goal}
Platform: ${inputs.platform}
Posting Frequency: ${inputs.frequency}

Generate a 30-day content calendar:

## Strategy Overview
3-4 sentences explaining the overall approach and why it fits this business and goal.

## Content Mix
Percentage breakdown of content types (e.g., 40% educational, 30% entertaining, 30% promotional). Explain the rationale.

## Week 1 (Days 1–7)
For each post day, include:
- Day & Date reference (Day 1, Day 2, etc.)
- Format: [Reel / Carousel / Static Post / Story]
- Topic/Theme
- Hook (opening line or visual concept)
- Caption direction (2-3 sentences on what to write)

## Week 2 (Days 8–14)
Same format.

## Week 3 (Days 15–21)
Same format.

## Week 4 (Days 22–30)
Same format.

## Hashtag Strategy
15 hashtags organized into: Large (1M+), Medium (100K–1M), Niche (under 100K). Pick hashtags relevant to this specific business.

## Engagement Tactics
4 specific tactics for ${inputs.platform} to boost reach and engagement for this audience.

Make every day specific and actionable. No filler content.`;

    case 'content-pillars':
      return `You are a content strategist. Create a complete content pillar framework for this business.

Business Niche: ${inputs.niche}
Target Audience: ${inputs.audience}
Main Goals: ${inputs.goals}
Number of Pillars: ${inputs.pillars || '5'}

Generate a complete content pillar framework:

## Strategy Overview
3-4 sentences on the content approach and why these pillars fit this niche.

## Content Pillars

For each of the ${inputs.pillars || '5'} pillars, include:

### Pillar [N]: [Name]
**Purpose:** What this pillar achieves for the business
**Audience Value:** What the audience gets from it
**Funnel Stage:** Awareness / Trust / Conversion (or combination)

**10 Specific Post Ideas:**
1. [Specific post idea]
2. [Specific post idea]
(continue for all 10 — make them specific, not generic)

**Best Formats:** Which content formats work best for this pillar (Reel, Carousel, etc.)

## Content Mix Recommendation
Weekly posting split across pillars with rationale.

## Content Calendar Integration
How to schedule these pillars across 7 days.

## Quick Wins — 5 Posts to Create This Week
Specific, detailed post briefs they can execute immediately.

Be specific to this niche. Every post idea should be usable as-is.`;

    case 'hook-generator':
      return `You are a viral content strategist who understands exactly what makes people stop scrolling.

Topic/Niche: ${inputs.topic}
Platform: ${inputs.platform}
Content Angle: ${inputs.angle}
Target Audience: ${inputs.audience}

Generate 15 powerful, ready-to-use hooks organized by type. For EACH hook:
- Write the hook (complete, ready to use — not a template)
- Note the psychological trigger it activates
- Mark virality potential: 🔥 High / ⚡ Medium

## Pain-Point Hooks (3)
Hooks that lead with a specific frustration your audience feels.

## Curiosity & Open Loop Hooks (3)
Hooks that create an information gap — the viewer MUST keep watching to resolve it.

## Bold Statement Hooks (3)
Controversial, counter-intuitive, or surprising takes. Designed to spark debate or agreement.

## Story Hooks (3)
Hooks that drop into the middle of a story or relatable scenario. Past tense or "I used to..." format.

## Result & Transformation Hooks (3)
Hooks focused on a specific, tangible outcome. Numbers when possible.

## Bonus: 5 Headline-Style Hooks for Carousels/Ads
Short and punchy. Works as a slide 1 or ad headline.

Every hook must be specific to "${inputs.topic}" — zero generic filler.`;

    case 'ad-copy':
      return `You are a direct-response copywriter who writes ads that actually convert.

Product/Service: ${inputs.product}
What It Does: ${inputs.description}
Target Audience: ${inputs.audience}
Main Pain Point: ${inputs.painPoint}
Offer/Deal: ${inputs.offer}
Platform: ${inputs.platform}

Write 3 complete ad copy variations:

## Ad 1: Emotional / Story Angle
**Hook:** (Opening line — first 3 seconds. Must stop the scroll.)
**Primary Text:** (120-150 words. Lead with a relatable story or emotional scenario. Build to the offer.)
**Headline:** (Under 40 characters. Benefit-focused.)
**CTA:** (Specific action)
**Why it works:** (1-2 sentences)

## Ad 2: Direct-Response / Benefit Angle
**Hook:**
**Primary Text:** (120-150 words. Lead with the biggest tangible benefit. Use specific numbers/claims where possible.)
**Headline:**
**CTA:**
**Why it works:**

## Ad 3: Problem / Agitate / Solution Angle
**Hook:**
**Primary Text:** (120-150 words. Name the problem, make it feel real, present the solution.)
**Headline:**
**CTA:**
**Why it works:**

## 5 Headline A/B Test Variations
Quick-fire headlines to split test.

## ${inputs.platform}-Specific Tips
4 platform-specific tactics to maximize this ad's performance.

Write copy that feels human, not robotic. Every word should earn its place.`;

    case 'marketing-strategy':
      return `You are a growth marketer. Create a focused, executable marketing strategy.

Business Type: ${inputs.businessType}
Product/Service: ${inputs.product}
Target Audience: ${inputs.audience}
Monthly Budget: ${inputs.budget}
Primary Goal: ${inputs.goal}
Current Channels: ${inputs.channels || 'None currently'}
Timeline: ${inputs.timeline}

Generate a complete marketing strategy:

## Executive Summary
4 sentences: situation, opportunity, recommended approach, expected outcome.

## Target Audience Deep-Dive
- **Demographics:** Age, location, income, occupation
- **Psychographics:** Values, fears, aspirations, daily habits
- **Pain Points:** Top 3 specific frustrations
- **Online Behavior:** Where they spend time, what content they consume
- **Purchase Triggers:** What makes them buy

## Positioning Statement
One clear, differentiating statement. "For [audience], [product] is the [category] that [unique benefit] because [reason to believe]."

## Recommended Channels (Prioritized)
For each channel recommended:
- Why it fits this specific business
- Budget allocation
- Expected 90-day results
- First 5 actions to take immediately

## Content Strategy
Content themes, formats, and cadence for the primary channel.

## ${inputs.timeline} Action Plan
Broken into phases. Specific weekly or monthly actions.

## KPIs & Success Metrics
6 specific KPIs with 90-day benchmark targets.

## Quick Wins (First 2 Weeks)
5 specific actions they can take before spending a dollar on ads.

Note: This is the strategic overview. Loraloop can execute this strategy automatically — content creation, scheduling, optimization, and reporting.`;

    case 'landing-page-copy':
      return `You are a conversion copywriter who writes landing pages that convert cold traffic into customers.

Product/Service: ${inputs.product}
What It Does: ${inputs.description}
Target Audience: ${inputs.audience}
Main Benefit/Outcome: ${inputs.benefit}
Price Point: ${inputs.price}
Primary CTA Goal: ${inputs.ctaGoal}

Write complete, conversion-optimized landing page copy:

## Hero Section
**H1:** (Clear, benefit-led, under 10 words — must communicate the core transformation)
**Subheadline:** (1-2 sentences expanding on the H1. Address skepticism.)
**CTA Button Text:** (Action-oriented, specific)
**Trust Signal:** (One short stat, proof point, or social proof)

## Problem Section
Agitate the pain. Make the reader feel understood. 2 short paragraphs. No fluff.

## Solution Bridge
Transition from problem to your product. 1-2 paragraphs. Introduce the product naturally.

## Benefits (5)
For each benefit:
- **Benefit Headline:** (Bold, specific)
- **Explanation:** (2 sentences. Focus on the transformation, not the feature.)

## Features (5)
Feature name + one-line description. Clear and jargon-free.

## Social Proof Section
- 3 testimonial frameworks (realistic, specific — fill in customer name/result)
- 1 stat or metric placeholder ("Join X+ businesses...")

## FAQ (5 Questions)
Answer the top 5 objections that would stop someone from converting. Be honest.

## Final CTA Section
**Headline:** (Creates urgency or reinforces the main benefit)
**Supporting Copy:** (2-3 sentences addressing last-minute hesitation)
**CTA Button Text:**
**Risk Reversal:** (Guarantee copy)

## SEO Meta Description
155 characters max. Include primary keyword naturally.

Write for conversion, not to impress. Clear > clever.`;

    case 'product-description':
      return `You are an eCommerce copywriter who writes product copy that sells.

Product Name: ${inputs.productName}
Category: ${inputs.category}
Key Features: ${inputs.features}
Target Customer: ${inputs.targetCustomer}
Platform: ${inputs.platform}
Tone: ${inputs.tone}

Generate complete product copy:

## SEO-Optimized Title
One title under 70 characters. Naturally include the primary keyword. Platform-appropriate.

## Short Description (50-80 words)
Punchy. Hook → key benefit → call to action. Written for scanning, not reading.

## Long Description (200-250 words)
Story-led. Open with the customer's situation, transition to how this product solves it, cover the key benefits (not just features), close with a clear CTA. ${inputs.tone} tone throughout.

## Bullet Points (5)
Format: **[Benefit]** — [Feature explanation]. Start every bullet with the BENEFIT, not the feature.
•
•
•
•
•

## Meta Description
155 characters max. Include primary keyword. Written to maximize click-through from search results.

## Instagram/Facebook Caption
Ready-to-post social caption with relevant emojis and 8-10 hashtags. Matches the ${inputs.tone} tone.

## Short Ad Copy (Facebook/Instagram)
Primary text for a Meta ad. Under 100 words. Hook → Problem → Solution → CTA. Conversion-focused.

## Suggested Alt Text
For the main product image. Descriptive and SEO-friendly.

Make every word earn its place. No generic filler.`;

    case 'competitor-audit':
      return `You are a competitive intelligence analyst. Analyze this competitor and map out exactly how to outperform them.

Your Business/Niche: ${inputs.yourBusiness}
Competitor Name: ${inputs.competitorName}
Competitor Bio/About: ${inputs.competitorBio}
Their Recent Posts/Content: ${inputs.recentPosts}
Platform: ${inputs.platform}

Generate a comprehensive competitive analysis:

## Competitor Overview
- **Positioning:** How they position themselves (in one sentence)
- **Target Audience:** Who they're speaking to
- **Content Style:** Tone, format preferences, posting frequency patterns
- **Apparent Strengths:** 3-4 things they do well
- **Brand Personality:** How they come across

## Content Analysis

### What They Focus On
Main topics, themes, and content types based on the posts provided.

### What's Working for Them
Based on the content, what strategies appear effective and why.

### Gaps & Weaknesses
5 specific things they are NOT doing or are doing poorly. Be precise.

## Your Opportunity Map

### 3 Content Gaps You Can Own
Specific angles, topics, or formats they're missing that your audience wants.

### Differentiation Strategy
How to position ${inputs.yourBusiness} clearly against ${inputs.competitorName}. Your unique angle.

### 5 Post Ideas to Outperform Them
Specific, detailed post concepts (topic + angle + format + hook) that would outperform their content.

## Immediate Actions (This Week)
3 specific actions to start building an advantage now.

## 90-Day Positioning Plan
How to build a sustainable competitive advantage over 3 months.

Be direct and specific. Insights, not observations.`;

    default:
      throw new Error(`Unknown tool: ${tool}`);
  }
}
