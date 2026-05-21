'use client';

import {
  PostComment,
  withProvider,
} from '@loraloop/frontend/components/new-launch/providers/high.order.provider';
import { ListmonkDto } from '@loraloop/nestjs-libraries/dtos/posts/providers-settings/listmonk.dto';
import { Input } from '@loraloop/react/form/input';
import { useSettings } from '@loraloop/frontend/components/launches/helpers/use.values';
import { SelectList } from '@loraloop/frontend/components/new-launch/providers/listmonk/select.list';
import { SelectTemplates } from '@loraloop/frontend/components/new-launch/providers/listmonk/select.templates';

const SettingsComponent = () => {
  const form = useSettings();

  return (
    <>
      <Input label="Subject" {...form.register('subject')} />
      <Input label="Preview" {...form.register('preview')} />
      <SelectList {...form.register('list')} />
      <SelectTemplates {...form.register('template')} />
    </>
  );
};

export default withProvider({
  postComment: PostComment.POST,
  minimumCharacters: [],
  SettingsComponent: SettingsComponent,
  CustomPreviewComponent: undefined,
  dto: ListmonkDto,
  checkValidity: undefined,
  maximumCharacters: 300000,
});
