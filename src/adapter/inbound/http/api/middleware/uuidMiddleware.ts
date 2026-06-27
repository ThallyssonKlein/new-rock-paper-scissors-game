import { Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import CustomRequest from './CustomRequest';
import Logger from '../../../../outbound/logging/Logger';

export default class UuidMiddleware {
  private logger: Logger

  constructor() {
    this.logger = new Logger('UidMiddleware')
    this.handle = this.handle.bind(this);
  }

  handle(req: CustomRequest, res: Response, next: NextFunction) {
    req.traceId = uuidv4();
    this.logger.info(`Request ${req.traceId} received`, req.traceId);
    next();
  }
}