import axios from 'axios';

export async function publishToTwitter(integration: any, post: any) {
  const response = await axios.post(
    'https://api.twitter.com/2/tweets',
    { text: post.content },
    {
      headers: {
        Authorization: `Bearer ${integration.accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );

  const tweetId = response.data.data.id;
  return {
    platformPostId: tweetId,
    platformUrl: `https://twitter.com/i/web/status/${tweetId}`,
  };
}
