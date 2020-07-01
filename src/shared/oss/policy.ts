export const uploadPolicy = {
  Statement: [
    {
      Action: [
        'oss:PutObject',
      ],
      Effect: 'Allow',
      Resource: [
        'acs:oss:*:*:soapphoto',
        'acs:oss:*:*:soapphoto/*',
      ],
    },
  ],
  Version: '1',
};
