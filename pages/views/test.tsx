import { CustomNextContext, CustomNextPage } from '@lib/common/interfaces/global';
import { IPictureListRequest } from '@lib/common/interfaces/picture';
import { PictureList } from '@lib/containers/Picture/List';
import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';

interface IProps {
  isPop: boolean;
}

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

const Test: CustomNextPage<IProps, any> = ({ isPop }) => {
  console.log(isPop);
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

Test.getInitialProps = async (_: CustomNextContext) => {
  if (
    _.mobxStore.appStore.location &&
    _.mobxStore.appStore.location.action === 'POP'
  ) {
    return {
      isPop: true,
    };
  }
  return {
    isPop: false,
  };
};

export default Test;
