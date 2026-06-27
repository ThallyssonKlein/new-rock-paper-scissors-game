import { NextFunction, Response } from "express";
import IGameUsecase from "../../../../../../application/posts/inbound/IGameUsecase";
import CustomRequest from "../../middleware/CustomRequest";
import Game from "../../../../../../application/domain/Game";

export default class GameController {
    constructor(
        private useCase: IGameUsecase
    ) {}
    
    public async start(req: CustomRequest, res: Response, next: NextFunction) {
        const userId = req.userId;

        const body = req.body
        const game = new Game();
        game.nextMove = body.nextMove
        game.status = body.status
        game.ownerId = userId

        const createdGame = await this.useCase.startGame(game);

        res.status(201).json(createdGame)
    }

    public nextServerMove() {
        if ()
    }

    public move() {}

    public end (){
        
    }
}