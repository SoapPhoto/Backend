import gql from 'graphql-tag';

export const tag = {
  detail: gql`
    fragment TagDetail on Tag {
      id
      name
      createTime
      updateTime
    }
  `,
};
