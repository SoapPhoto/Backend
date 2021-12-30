export const uploadPolicy = {
  Statement: [
    {
      Action: ['oss:PutObject'],
      Effect: 'Allow',
      Resource: ['acs:oss:*:*:soapphoto', 'acs:oss:*:*:soapphoto/*'],
    },
  ],
  Version: '1',
};

export const defaultPolicy = {
  Statement: [
    {
      Action: 'oss:*',
      Effect: 'Allow',
      Resource: ['acs:oss:*:*:soapphoto', 'acs:oss:*:*:soapphoto/*'],
    },
  ],
  Version: '1',
};
