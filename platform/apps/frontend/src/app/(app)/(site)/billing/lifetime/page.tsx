import { LifetimeDeal } from '@loraloop/frontend/components/billing/lifetime.deal';
export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@loraloop/helpers/utils/is.general.server.side';
export const metadata: Metadata = {
  title: `${isGeneralServerSide() ? 'Loraloop' : 'Loraloop'} Lifetime deal`,
  description: '',
};
export default async function Page() {
  return <LifetimeDeal />;
}
