'use client';

import {
  PostComment,
  withProvider,
} from '@loraloop/frontend/components/new-launch/providers/high.order.provider';
import { FC } from 'react';
import { useSettings } from '@loraloop/frontend/components/launches/helpers/use.values';
import { SlackChannelSelect } from '@loraloop/frontend/components/new-launch/providers/slack/slack.channel.select';
import { SlackDto } from '@loraloop/nestjs-libraries/dtos/posts/providers-settings/slack.dto';
const SlackComponent: FC = () => {
  const form = useSettings();
  return (
    <div>
      <SlackChannelSelect {...form.register('channel')} />
    </div>
  );
};
export default withProvider({
  postComment: PostComment.COMMENT,
  minimumCharacters: [],
  SettingsComponent: SlackComponent,
  CustomPreviewComponent: undefined,
  dto: SlackDto,
  checkValidity: undefined,
  maximumCharacters: 400000,
});
