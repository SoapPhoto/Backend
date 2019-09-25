import gql from 'graphql-tag';
import { picture } from '../fragments';

export const GET_PICTURE = gql`
  query Picture($id: ID!) {
    picture(id: $id) {
      ${picture}
    }
  }
`;
