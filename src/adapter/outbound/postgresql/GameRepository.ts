import { Repository } from "typeorm";
import { AppDataSource } from "./AppDataSource";
import { GameEntity } from "./entities/GameEntity";
import Game from "../../../application/domain/game/Game";
import IGameRepository from "../../../application/posts/outbound/postgresql/IGameRepository";

export default class GameRepository implements IGameRepository {
    private repository: Repository<GameEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(GameEntity);
    }

    async save(game: Game): Promise<Game> {
        const entity = this.repository.create({
            nextMove: game.nextMove ?? null,
            status: game.status ?? null,
            ownerId: game.ownerId!,
        });

        const saved = await this.repository.save(entity);

        return new Game(saved.id, saved.nextMove ?? undefined, saved.status ?? undefined, saved.ownerId);
    }

    async findByOwnerIdAndGameId(ownerId: number, gameId: number): Promise<Game | null> {
        const entity = await this.repository.findOne({
            where: { ownerId, id: gameId },
        });

        if (!entity) return null;
        return new Game(entity.id, entity.nextMove ?? undefined, entity.status ?? undefined, entity.ownerId);
    }
}
