import gql from 'graphql-tag';

export const pictureEntry = `
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
`;

export const tagEntry = `
  id
  name
  createTime
  updateTime
`;

export const collectionEntry = `
  id
  name
  bio
  isPrivate
  pictureCount
  createTime
  updateTime
`;

export const userEntry = `
  id
  username
  fullName
  name
  email
  avatar
  bio
  website
  likes
  pictureCount
  createTime
  updateTime
`;

export const EXIFEntry = `
  aperture
  exposureTime
  focalLength
  iso
`;
