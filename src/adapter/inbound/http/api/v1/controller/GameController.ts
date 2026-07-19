import { NextFunction, Response } from "express";
import IStartGameUsecase from "../../../../../../application/posts/inbound/IStartGameUsecase";
import { AuthenticatedRequest } from "../../middleware/CustomRequest";
import Game from "../../../../../../application/domain/game/Game";
import INextServerMoveUsecase from "../../../../../../application/posts/inbound/INextServerMoveUsecase";

export default class GameController {
    constructor(
        private startGameUseCase: IStartGameUsecase,
        private nextServerMovementUsecase: INextServerMoveUsecase
    ) {}

    public async start(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const userId = req.userId;

        const body = req.body;
        const game = new Game();
        game.nextMove = body.nextMove;
        game.status = body.status;
        game.ownerId = userId;

        const createdGame = await this.startGameUseCase.startGame(game);

        res.status(201).json(createdGame);
    }

    public async nextServerMove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const gameId = Number(req.params.gameId)
        const userId = req.userId;

        const generatedMovement = await this.nextServerMovementUsecase.nextServerMove(gameId, userId, req.traceId);

        res.status(201).json(generatedMovement)
    }

    public move() {}

    public end() {}
}
