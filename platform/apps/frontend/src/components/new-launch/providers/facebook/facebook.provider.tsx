'use client';

import {
  PostComment,
  withProvider,
} from '@loraloop/frontend/components/new-launch/providers/high.order.provider';
import { FacebookDto } from '@loraloop/nestjs-libraries/dtos/posts/providers-settings/facebook.dto';
import { Input } from '@loraloop/react/form/input';
import { Select } from '@loraloop/react/form/select';
import { useSettings } from '@loraloop/frontend/components/launches/helpers/use.values';
import { FacebookPreview } from '@loraloop/frontend/components/new-launch/providers/facebook/facebook.preview';
import { useT } from '@loraloop/react/translation/get.transation.service.client';

const postType = [
  {
    value: 'post',
    label: 'Post',
  },
  {
    value: 'story',
    label: 'Story',
  },
];

export const FacebookSettings = () => {
  const t = useT();
  const { register, watch } = useSettings();
  const postCurrentType = watch('post_type');

  return (
    <>
      <Select
        label="Post Type"
        {...register('post_type', {
          value: 'post',
        })}
      >
        <option value="">{t('select_post_type', 'Select Post Type...')}</option>
        {postType.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </Select>

      {postCurrentType !== 'story' && (
        <Input
          label={'Embedded URL (only for text Post)'}
          {...register('url')}
        />
      )}
    </>
  );
};

export default withProvider<FacebookDto>({
  postComment: PostComment.COMMENT,
  minimumCharacters: [],
  SettingsComponent: FacebookSettings,
  CustomPreviewComponent: FacebookPreview,
  dto: FacebookDto,
  checkValidity: async ([firstPost, ...otherPosts] = [], settings) => {
    if (settings?.post_type === 'story') {
      if (!firstPost?.length) {
        return 'Story should have at least one media';
      }
    }
    return true;
  },
  maximumCharacters: 63206,
});
