import gql from 'graphql-tag';
import {
  pictureEntry, userEntry, collectionEntry, tagEntry, EXIFEntry,
} from '../fragments';

export const GET_PICTURE = gql`
  query Picture($id: ID!) {
    picture(id: $id) {
      ${pictureEntry}
      user {
        ${userEntry}
      }
      tags {
        ${tagEntry}
      }
      currentCollections {
        ${collectionEntry}
      }
      exif {
        ${EXIFEntry}
      }
    }
  }
`;
