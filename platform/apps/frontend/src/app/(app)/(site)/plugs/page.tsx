import { Plugs } from '@loraloop/frontend/components/plugs/plugs';
export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@loraloop/helpers/utils/is.general.server.side';
export const metadata: Metadata = {
  title: `${isGeneralServerSide() ? 'Loraloop' : 'Loraloop'} Plugs`,
  description: '',
};
export default async function Index() {
  return <Plugs />;
}
