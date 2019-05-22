import { Request } from 'express';

export const clientInfo = (req: Request) => {
  return {
    agent: req.header('user-agent'),
    referrer: req.header('referrer'),
    ip: req.header('x-forwarded-for') || req.connection.remoteAddress,
    screen: {
      width: req.param('width'),
      height: req.param('height'),
    },
  };
};
