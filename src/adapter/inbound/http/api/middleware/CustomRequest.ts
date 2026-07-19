import { Request } from "express";

export default interface CustomRequest extends Request {
    traceId?: string;
    userId?: number;
}

// Request that has already passed through ProtectedRouteMiddleware,
// so `userId` is guaranteed to be set.
export interface AuthenticatedRequest extends CustomRequest {
    userId: number;
}