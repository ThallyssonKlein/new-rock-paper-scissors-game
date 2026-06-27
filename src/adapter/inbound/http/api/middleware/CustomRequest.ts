import { Request } from "express";

export default interface CustomRequest extends Request {
    traceId?: string;
    userId?: bumber;
}