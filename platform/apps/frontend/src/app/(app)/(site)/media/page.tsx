import { MediaLayoutComponent } from '@loraloop/frontend/components/new-layout/layout.media.component';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@loraloop/helpers/utils/is.general.server.side';

export const metadata: Metadata = {
  title: `${isGeneralServerSide() ? 'Loraloop' : 'Gitroom'} Media`,
  description: '',
};

export default async function Page() {
  return <MediaLayoutComponent />
}
