export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { Activate } from '@loraloop/frontend/components/auth/activate';
import { isGeneralServerSide } from '@loraloop/helpers/utils/is.general.server.side';
export const metadata: Metadata = {
  title: `${
    isGeneralServerSide() ? 'Loraloop' : 'Gitroom'
  } - Activate your account`,
  description: '',
};
export default async function Auth() {
  return <Activate />;
}
