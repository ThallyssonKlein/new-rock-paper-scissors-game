import { Repository } from "typeorm";
import { AppDataSource } from "./AppDataSource";
import { MovementEntity } from "./entities/MovementEntity";
import Movement from "../../../application/domain/movement/Movement";
import IMovementRepository from "../../../application/posts/outbound/postgresql/IMovementRepository";

export default class MovementRepository implements IMovementRepository {
    private repository: Repository<MovementEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(MovementEntity);
    }

    async findAllMovementsFromOnePlayer(playerId: number): Promise<Movement[]> {
        const entities = await this.repository.find({
            where: { playerId },
        });

        return entities.map(
            (e) => new Movement(e.id, e.value, e.salt, e.hash, e.playerId, e.gameId, e.createdAt)
        );
    }
}
