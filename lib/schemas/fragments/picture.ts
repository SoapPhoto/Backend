import gql from 'graphql-tag';
import { tag } from '@lib/schemas/fragments/tag';

export const exif = {
  entry: gql`
    fragment EXIFEntry on EXIF {
      aperture: Float
      exposureTime: String
      focalLength: Float
      iso: Float
    }
  `,
};

export const picture = {
  detail: gql`
    fragment PictureDetail on Picture {
      id
      key
      hash
      title
      bio
      views
      originalname
      mimetype
      size
      isLike
      likes
      color
      isDark
      height
      width
      make
      model
      createTime
      updateTime
      tags {
        ...TagDetail
      }
    }
    ${tag.detail}
  `,
};
