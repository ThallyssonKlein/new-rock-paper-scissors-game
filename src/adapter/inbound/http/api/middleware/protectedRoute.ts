import { Response, NextFunction } from 'express';
import Logger from '../../../../outbound/logging/Logger';
import CustomRequest from './CustomRequest';
import ITokenProvider from '../../../../../application/posts/outbound/security/ITokenProvider';

export default class ProtectedRouteMiddleware {
  private logger: Logger

  constructor(private tokenProvider: ITokenProvider) {
    this.handle = this.handle.bind(this);
    this.logger = new Logger("ProtectedRoute")
  }

  handle(req: CustomRequest, res: Response, next: NextFunction) {
    const header = req.header('Authorization');
    if (!header) {
      this.logger.error('No token provided', req.traceId);
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = header.startsWith('Bearer ') ? header.slice(7) : header;

    try {
      const payload = this.tokenProvider.verify(token);
      req.userId = payload.id;
      this.logger.info('Token verified', req.traceId);
      next();
    } catch (err) {
      this.logger.error('Invalid token', req.traceId, err);
      res.status(401).json({ error: 'Invalid token' });
    }
  }
}