import axios from 'axios';

export async function publishToLinkedIn(integration: any, post: any) {
  const isPage = integration.platform === 'LINKEDIN_PAGE';
  const author = isPage
    ? `urn:li:organization:${integration.accountId}`
    : `urn:li:person:${integration.accountId}`;

  const body = {
    author,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text: post.content },
        shareMediaCategory: 'NONE',
      },
    },
    visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
  };

  const response = await axios.post('https://api.linkedin.com/v2/ugcPosts', body, {
    headers: {
      Authorization: `Bearer ${integration.accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
  });

  const postUrn = response.headers['x-restli-id'] || response.data.id;
  return {
    platformPostId: postUrn,
    platformUrl: `https://www.linkedin.com/feed/update/${postUrn}`,
  };
}
