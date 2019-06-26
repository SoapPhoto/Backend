import { IPictureListRequest } from '@pages/common/interfaces/picture';
import { PictureList } from '@pages/containers/Picture/List';
import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';

const GET_PICTURE = gql`
  {
    pictures {
      page
      pageSize
      data {
        id
        key
        width
        height
        isLike
        user {
          id
          username
          name
        }
      }
    }
  }
`;

const Test: React.FC = () => {
  return (
    <Query<{pictures: IPictureListRequest}> query={GET_PICTURE} fetchPolicy="cache-and-network">
      {({ loading, error, data }) => {
        if (loading && !data!.pictures) return 'Loading...';
        if (error) return `Error! ${error.message}`;
        const { pictures } = data!;
        return (
          <div>
            <PictureList
              data={pictures.data}
              noMore={true}
              onPage={async () => console.log(12)}
              like={() => {}}
            />
          </div>
        );
      }}
    </Query>
  );
};

export default Test;
