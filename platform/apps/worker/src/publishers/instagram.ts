import axios from 'axios';

export async function publishToInstagram(integration: any, post: any) {
  const media = post.media?.[0];

  if (!media?.url) {
    throw new Error('Instagram requires at least one image');
  }

  const containerRes = await axios.post(
    `https://graph.facebook.com/v18.0/${integration.accountId}/media`,
    {
      image_url: media.url,
      caption: post.content,
      access_token: integration.accessToken,
    },
  );

  const containerId = containerRes.data.id;

  const publishRes = await axios.post(
    `https://graph.facebook.com/v18.0/${integration.accountId}/media_publish`,
    { creation_id: containerId, access_token: integration.accessToken },
  );

  const postId = publishRes.data.id;
  return {
    platformPostId: postId,
    platformUrl: `https://www.instagram.com/p/${postId}/`,
  };
}
