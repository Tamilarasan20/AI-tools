import axios from 'axios';

export async function publishToFacebook(integration: any, post: any) {
  const response = await axios.post(
    `https://graph.facebook.com/v18.0/${integration.accountId}/feed`,
    {
      message: post.content,
      access_token: integration.accessToken,
    },
  );

  const postId = response.data.id;
  return {
    platformPostId: postId,
    platformUrl: `https://www.facebook.com/${postId}`,
  };
}
