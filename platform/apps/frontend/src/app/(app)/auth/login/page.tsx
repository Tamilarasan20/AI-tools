export const dynamic = 'force-dynamic';
import { Login } from '@loraloop/frontend/components/auth/login';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@loraloop/helpers/utils/is.general.server.side';
export const metadata: Metadata = {
  title: `${isGeneralServerSide() ? 'Loraloop' : 'Loraloop'} Login`,
  description: '',
};
export default async function Auth() {
  return <Login />;
}
