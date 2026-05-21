export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { PlatformAnalytics } from '@loraloop/frontend/components/platform-analytics/platform.analytics';
import { isGeneralServerSide } from '@loraloop/helpers/utils/is.general.server.side';
export const metadata: Metadata = {
  title: `${isGeneralServerSide() ? 'Loraloop' : 'Gitroom'} Analytics`,
  description: '',
};
export default async function Index() {
  return <PlatformAnalytics />;
}
