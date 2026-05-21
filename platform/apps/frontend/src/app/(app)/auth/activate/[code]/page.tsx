export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { AfterActivate } from '@loraloop/frontend/components/auth/after.activate';
import { isGeneralServerSide } from '@loraloop/helpers/utils/is.general.server.side';
export const metadata: Metadata = {
  title: `${
    isGeneralServerSide() ? 'Loraloop' : 'Gitroom'
  } - Activate your account`,
  description: '',
};
export default async function Auth() {
  return <AfterActivate />;
}
