import Logger from "../../adapter/outbound/logging/Logger";
import Game from "../domain/game/Game";
import IGameRepository from "../posts/outbound/postgresql/IGameRepository";
import IRedisAdapter from "../posts/outbound/redis/IRedisAdapter";
import IStartGameUsecase from "../posts/inbound/IStartGameUsecase";

export default class StartGameUseCase implements IStartGameUsecase {
    private logger: Logger

    constructor(
        private gameRepository: IGameRepository,
        private redisAdapter: IRedisAdapter,
    ) {
        this.logger = new Logger("GameUseCase")
    }

    async startGame(game: Game): Promise<Game> {
        const saved = await this.gameRepository.save(game);
        this.logger.info('Game saved')
        await this.redisAdapter.set(`game_:${saved.id}_owner`, game.ownerId + '');
        this.logger.info('Game owner setted on cache')
        await this.redisAdapter.set(`turn_${saved.id}`, 'player');
        this.logger.info('Turn saved on cache')
        return saved;
    }

    
}