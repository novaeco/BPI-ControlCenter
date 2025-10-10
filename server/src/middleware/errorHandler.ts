import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

export class HttpError extends Error {
  public readonly status: number;
  public readonly details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (error: Error, req: Request, res: Response, _next: NextFunction): void => {
  if (error instanceof HttpError) {
    logger.warn({ err: error, path: req.path }, 'Handled HTTP error');
    res.status(error.status).json({
      status: error.status,
      message: error.message,
      details: error.details ?? null
    });
    return;
  }

  logger.error({ err: error, path: req.path }, 'Unhandled error');
  res.status(500).json({
    status: 500,
    message: 'Une erreur inattendue est survenue.'
  });
};
