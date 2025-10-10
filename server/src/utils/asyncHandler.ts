import { Request, Response, NextFunction, RequestHandler } from 'express';

export const asyncHandler = <P, ResBody, ReqBody, ReqQuery>(
  handler: (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response<ResBody>, next: NextFunction) => Promise<void>
): RequestHandler<P, ResBody, ReqBody, ReqQuery> => {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
};
