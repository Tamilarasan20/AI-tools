export const dynamic = 'force-dynamic';
import { Forgot } from '@loraloop/frontend/components/auth/forgot';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@loraloop/helpers/utils/is.general.server.side';
export const metadata: Metadata = {
  title: `${isGeneralServerSide() ? 'Loraloop' : 'Loraloop'} Forgot Password`,
  description: '',
};
export default async function Auth() {
  return <Forgot />;
}
