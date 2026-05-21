'use client';

import { FC } from 'react';
import {
  PostComment,
  withProvider,
} from '@loraloop/frontend/components/new-launch/providers/high.order.provider';
import { useSettings } from '@loraloop/frontend/components/launches/helpers/use.values';
import { Input } from '@loraloop/react/form/input';
import { MediumPublications } from '@loraloop/frontend/components/new-launch/providers/medium/medium.publications';
import { MediumTags } from '@loraloop/frontend/components/new-launch/providers/medium/medium.tags';
import { MediumSettingsDto } from '@loraloop/nestjs-libraries/dtos/posts/providers-settings/medium.settings.dto';
import { useIntegration } from '@loraloop/frontend/components/launches/helpers/use.integration';
import { Canonical } from '@loraloop/react/form/canonical';

const MediumSettings: FC = () => {
  const form = useSettings();
  const { date } = useIntegration();
  return (
    <>
      <Input label="Title" {...form.register('title')} />
      <Input label="Subtitle" {...form.register('subtitle')} />
      <Canonical
        date={date}
        label="Canonical Link"
        {...form.register('canonical')}
      />
      <div>
        <MediumPublications {...form.register('publication')} />
      </div>
      <div>
        <MediumTags label="Topics" {...form.register('tags')} />
      </div>
    </>
  );
};
export default withProvider({
  postComment: PostComment.POST,
  minimumCharacters: [],
  SettingsComponent: MediumSettings,
  CustomPreviewComponent: undefined, //MediumPreview,
  dto: MediumSettingsDto,
  checkValidity: undefined,
  maximumCharacters: 100000,
});
