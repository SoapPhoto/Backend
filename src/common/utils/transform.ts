
export const transformAvatar = (value: string) => {
  if (/^qiniu:/g.test(value)) {
    const data = value.replace(/^qiniu:/, '').split('|');
    if (data && data[1]) return `${process.env.CDN_URL}/${data[1]}`;
    return `${process.env.CDN_URL}/default.svg`;
  }
  return value;
};

export const transformJson = (value: string) => {
  try {
    if (value) {
      return JSON.parse(value);
    }
    return undefined;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};
