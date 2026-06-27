import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import Logger from '../../../../outbound/logging/Logger';
import CustomRequest from './CustomRequest';

export default class ProtectedRouteMiddleware {
  private logger: Logger
  
  constructor() {
    this.handle = this.handle.bind(this);
    this.logger = new Logger("ProtectedRoute")
  }

  handle(req: CustomRequest, res: Response, next: NextFunction) {
    const token = req.header('Authorization');
    if (!token) {
      this.logger.error('No token provided', req.traceId);
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET as string);
      req.user_id = verified;
      this.logger.info('Token verified', req.traceId);
      next();
    } catch (err) {
      this.logger.error('Invalid token', req.traceId);
      res.status(401).json({ error: 'Invalid token' });
    }
  }
}