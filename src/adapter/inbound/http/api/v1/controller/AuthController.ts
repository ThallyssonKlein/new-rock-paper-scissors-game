import { NextFunction, Response } from "express";
import CustomRequest from "../../middleware/CustomRequest";
import IAuthUsecase from "../../../../../../application/posts/inbound/IAuthUsecase";
import UserAlreadyExistsError from "../../../../../../application/domain/error/UserAlreadyExistsError";
import InvalidCredentialsError from "../../../../../../application/domain/error/InvalidCredentialsError";

export default class AuthController {
    constructor(
        private authUsecase: IAuthUsecase
    ) {}

    public async register(req: CustomRequest, res: Response, next: NextFunction) {
        const { username, password } = req.body ?? {};
        if (!username || !password) {
            return res.status(400).json({ error: "username and password are required" });
        }

        try {
            const token = await this.authUsecase.register(username, password);
            return res.status(201).json({ token });
        } catch (err) {
            if (err instanceof UserAlreadyExistsError) {
                return res.status(409).json({ error: err.message });
            }
            return next(err);
        }
    }

    public async login(req: CustomRequest, res: Response, next: NextFunction) {
        const { username, password } = req.body ?? {};
        if (!username || !password) {
            return res.status(400).json({ error: "username and password are required" });
        }

        try {
            const token = await this.authUsecase.login(username, password);
            return res.status(200).json({ token });
        } catch (err) {
            if (err instanceof InvalidCredentialsError) {
                return res.status(401).json({ error: err.message });
            }
            return next(err);
        }
    }
}
