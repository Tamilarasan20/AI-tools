export const dynamic = 'force-dynamic';
import { LaunchesComponent } from '@loraloop/frontend/components/launches/launches.component';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@loraloop/helpers/utils/is.general.server.side';
export const metadata: Metadata = {
  title: `${isGeneralServerSide() ? 'Loraloop Calendar' : 'Gitroom Launches'}`,
  description: '',
};
export default async function Index() {
  return <LaunchesComponent />;
}
