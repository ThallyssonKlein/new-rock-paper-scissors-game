import Game from "../domain/Game";
import IGameRepository from "../posts/IGameRepository";
import IGameUsecase from "../posts/inbound/IGameUsecase";

export default class GameUseCase implements IGameUsecase {
    constructor(
        private gameRepository: IGameRepository
    ) {}
    
    startGame(game: Game): Promise<Game> {
        return this.gameRepository.save(game)
    }

    nextServerMove(gameId: number) {
        
    }
}