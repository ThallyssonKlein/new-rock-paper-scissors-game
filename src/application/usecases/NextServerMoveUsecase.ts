import Logger from "../../adapter/outbound/logging/Logger"
import GameClosedError from "../domain/error/GameClosedError";
import InvalidGameOwnerError from "../domain/error/InvalidGameOwnerError";
import PlayerTurnError from "../domain/error/PlayerTurnError";
import { Status } from "../domain/game/Status";
import IMovementUsecase from "../posts/inbound/IMovementUsecase";
import INextServerMoveUsecase from "../posts/inbound/INextServerMoveUsecase"
import IGameRepository from "../posts/outbound/postgresql/IGameRepository";
import IMovementRepository from "../posts/outbound/postgresql/IMovementRepository";
import IRedisAdapter from "../posts/outbound/redis/IRedisAdapter";

export default class NextServerMoveUseCase implements INextServerMoveUsecase  {
    private logger: Logger
    private readonly ONE_DAY = 86400000;

    constructor (
        private gameRepository: IGameRepository,
        private redisAdapter: IRedisAdapter,
        private movementsRepository: IMovementRepository,
        private movementUseCase: IMovementUsecase
    ) {
        this.logger = new Logger("NextServerMoveUsecase")
    }

    private async verifyOwner(gameId: number, userId: number) {
        const resultFromCache = await this.redisAdapter.get(`game_${gameId}_owner`)

        if (resultFromCache) {
            return true;
        }

        const resultFromDB = await this.gameRepository.findByOwnerIdAndGameId(userId, gameId);

        if (!resultFromDB) {
            return false
        }

        await this.redisAdapter.set(`game_:${gameId}_owner`, userId + '', this.ONE_DAY);

        return true;
    }

    async nextServerMove(gameId: number, userId: number, traceId: string) {
        const isOwner = await this.verifyOwner(gameId, userId)

        if (!isOwner) {
            this.logger.warn("Invalid Game Owner, userId: " + userId + " gameId: " + gameId, traceId)
            throw new InvalidGameOwnerError(userId, gameId)
        }

        const game = await this.gameRepository.findByOwnerIdAndGameId(userId, gameId)

        if (!game || !game.id) {
            this.logger.error('Invalid game!', traceId)
            throw new Error('Invalid Game!')
        }

        if (game.status !== Status.OPENED) {
            this.logger.warn("GameClosedError: gameId: " + gameId, traceId)
            throw new GameClosedError(game.id)
        }

        const turn = await this.redisAdapter.get('turn:' + gameId)
        if (turn !== 'server') {
            throw new PlayerTurnError(gameId)
        }

        const playerMovements = await this.movementsRepository.findAllMovementsFromOnePlayer(userId);

        const serverMovement = this.movementUseCase.generateServerMovement(playerMovements)

        
    }
}