import { Router, Response, Request, NextFunction } from "express";
import GameController from "./v1/controller/GameController";
import UuidMiddleware from "./middleware/uuidMiddleware";
import ProtectedRouteMiddleware from "./middleware/protectedRoute";
import CustomRequest from "./middleware/CustomRequest";

export default class Routes {
    private router: Router = Router();

    constructor(
        private gameController: GameController
    ) {}

    getRouter() {
        return this.router;
    }

    setupRouter() {
        const uuidMiddleware = new UuidMiddleware()
        const protectedRoute = new ProtectedRouteMiddleware()

        this.router.get("/ping", (_, res: Response) => res.send("pong"));
        this.router.post("/api/v1/game/start", uuidMiddleware.handle, protectedRoute.handle, (req: CustomRequest, res: Response, next: NextFunction) => this.gameController.start(req, res, next))
    }
}