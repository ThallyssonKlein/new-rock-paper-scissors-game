import { NextFunction, Response } from "express";
import IStartGameUsecase from "../../../../../../application/posts/inbound/IStartGameUsecase";
import CustomRequest from "../../middleware/CustomRequest";
import Game from "../../../../../../application/domain/game/Game";

export default class GameController {
    constructor(
        private startGameUseCase: IStartGameUsecase
    ) {}

    public async start(req: CustomRequest, res: Response, next: NextFunction) {
        const userId = req.userId;

        const body = req.body;
        const game = new Game();
        game.nextMove = body.nextMove;
        game.status = body.status;
        game.ownerId = userId;

        const createdGame = await this.startGameUseCase.startGame(game);

        res.status(201).json(createdGame);
    }

    public nextServerMove() {}

    public move() {}

    public end() {}
}
