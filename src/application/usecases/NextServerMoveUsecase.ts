import Logger from "../../adapter/outbound/logging/Logger"
import Config from "../../config";
import GameClosedError from "../domain/error/GameClosedError";
import InvalidGameOwnerError from "../domain/error/InvalidGameOwnerError";
import PlayerTurnError from "../domain/error/PlayerTurnError";
import { Status } from "../domain/game/Status";
import Movement from "../domain/movement/Movement";
import IMovementUsecase from "../posts/inbound/IMovementUsecase";
import INextServerMoveUsecase from "../posts/inbound/INextServerMoveUsecase"
import IGameRepository from "../posts/outbound/postgresql/IGameRepository";
import IMovementRepository from "../posts/outbound/postgresql/IMovementRepository";
import IRedisAdapter from "../posts/outbound/redis/IRedisAdapter";

export default class NextServerMoveUseCase implements INextServerMoveUsecase  {
    private logger: Logger
    private config = new Config().getConfig();

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

        await this.redisAdapter.set(`game_:${gameId}_owner`, userId + '');

        return true;
    }

    async nextServerMove(gameId: number, userId: number, traceId?: string) {
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
        this.logger.info("Player movements found", traceId)

        const serverMovement = this.movementUseCase.generateServerMovement(playerMovements)
        const salt = this.movementUseCase.generateSalt();
        const hash = this.movementUseCase.generateHash(serverMovement, salt)
        const movement: Omit<Movement, 'id' | 'createdAt'> = {
            value: serverMovement, 
            salt, 
            hash,
            playerId: this.config.playerIdServer,
            gameId: game.id,
        }
        this.logger.info("Server movement, salt and hash generated", traceId)

        const savedMovement = await this.movementsRepository.saveMovement(movement)
        this.logger.info("Movement saved", traceId)
        
        await this.redisAdapter.set('turn:' + gameId, userId + '')
        this.logger.info("Turn saved on cache", traceId)

        return savedMovement;
    }
}