const { GraphQLClient } = require('graphql-request');

const graphQLClient = new GraphQLClient('http://127.0.0.1:3001/graphql', {
  credentials: 'include',
  mode: 'cors',
  headers: {
    Authorization: 'Bearer b5eeb842368ab1495ad529ce85846fb113dc536b',
  },
});

const test = async () => {
  console.time('request');
  const data = await graphQLClient.request(`
    query Picture{
      picture(id: 79) {
        id
        isLike
      }
    }
  `);
  console.timeEnd('request');
  console.log(data);
};
test();
