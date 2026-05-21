import { PrismaClient } from '@loraloop/database';
import { Platform } from '@loraloop/shared';
import { decrypt } from './utils/encryption';
import { publishToTwitter } from './publishers/twitter';
import { publishToLinkedIn } from './publishers/linkedin';
import { publishToInstagram } from './publishers/instagram';
import { publishToFacebook } from './publishers/facebook';

const prisma = new PrismaClient();

type PublishResult = { platformPostId: string; platformUrl: string };

const PUBLISHERS: Partial<Record<Platform, (integration: any, post: any) => Promise<PublishResult>>> = {
  [Platform.TWITTER]: publishToTwitter,
  [Platform.LINKEDIN_PERSONAL]: publishToLinkedIn,
  [Platform.LINKEDIN_PAGE]: publishToLinkedIn,
  [Platform.INSTAGRAM]: publishToInstagram,
  [Platform.FACEBOOK]: publishToFacebook,
};

export async function processPublishJob(data: { postId: string }) {
  const { postId } = data;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      postIntegrations: {
        where: { state: { in: ['DRAFT', 'SCHEDULED'] } },
        include: { integration: true },
      },
    },
  });

  if (!post) {
    console.error(`[Processor] Post ${postId} not found`);
    return;
  }

  await prisma.post.update({ where: { id: postId }, data: { state: 'PUBLISHING' } });

  const results = await Promise.allSettled(
    post.postIntegrations.map(async (pi) => {
      const integration = pi.integration;
      const publisher = PUBLISHERS[integration.platform as Platform];

      if (!publisher) {
        await prisma.postIntegration.update({
          where: { id: pi.id },
          data: { state: 'FAILED', errorMessage: `No publisher for platform ${integration.platform}` },
        });
        return;
      }

      const decryptedIntegration = {
        ...integration,
        accessToken: decrypt(integration.accessToken),
        refreshToken: integration.refreshToken ? decrypt(integration.refreshToken) : null,
      };

      try {
        const result = await publisher(decryptedIntegration, post);
        await prisma.postIntegration.update({
          where: { id: pi.id },
          data: {
            state: 'PUBLISHED',
            platformPostId: result.platformPostId,
            platformUrl: result.platformUrl,
            publishedAt: new Date(),
            errorMessage: null,
          },
        });
      } catch (err: any) {
        console.error(`[Processor] Failed to publish to ${integration.platform}:`, err.message);
        await prisma.postIntegration.update({
          where: { id: pi.id },
          data: { state: 'FAILED', errorMessage: err.message },
        });
      }
    }),
  );

  const updatedIntegrations = await prisma.postIntegration.findMany({
    where: { postId },
  });

  const allPublished = updatedIntegrations.every((pi) => pi.state === 'PUBLISHED');
  const anyPublished = updatedIntegrations.some((pi) => pi.state === 'PUBLISHED');
  const allFailed = updatedIntegrations.every((pi) => pi.state === 'FAILED');

  const finalState = allFailed ? 'FAILED' : anyPublished ? 'PUBLISHED' : 'FAILED';

  await prisma.post.update({
    where: { id: postId },
    data: {
      state: finalState,
      publishedAt: anyPublished ? new Date() : null,
    },
  });
}
