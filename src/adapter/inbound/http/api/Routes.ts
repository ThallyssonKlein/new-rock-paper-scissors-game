import { Router, Response, Request, NextFunction } from "express";
import GameController from "./v1/controller/GameController";
import AuthController from "./v1/controller/AuthController";
import UuidMiddleware from "./middleware/uuidMiddleware";
import ProtectedRouteMiddleware from "./middleware/protectedRoute";
import CustomRequest, { AuthenticatedRequest } from "./middleware/CustomRequest";
import ITokenProvider from "../../../../application/posts/outbound/security/ITokenProvider";

export default class Routes {
    private router: Router = Router();

    constructor(
        private gameController: GameController,
        private authController: AuthController,
        private tokenProvider: ITokenProvider
    ) {}

    getRouter() {
        return this.router;
    }

    setupRouter() {
        const uuidMiddleware = new UuidMiddleware()
        const protectedRoute = new ProtectedRouteMiddleware(this.tokenProvider)

        this.router.get("/ping", (_, res: Response) => res.send("pong"));

        this.router.post("/api/v1/auth/register", uuidMiddleware.handle, (req: CustomRequest, res: Response, next: NextFunction) => this.authController.register(req, res, next))
        this.router.post("/api/v1/auth/login", uuidMiddleware.handle, (req: CustomRequest, res: Response, next: NextFunction) => this.authController.login(req, res, next))

        this.router.post("/api/v1/game/start", uuidMiddleware.handle, protectedRoute.handle, (req: CustomRequest, res: Response, next: NextFunction) => this.gameController.start(req as AuthenticatedRequest, res, next))
    }
}
