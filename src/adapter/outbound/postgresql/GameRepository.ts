import { PrismaClient } from "../../../generated/prisma";
import Game from "../../../application/domain/Game";
import IGameRepository from "../../../application/posts/IGameRepository";

export default class GameRepository implements IGameRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async save(game: Game): Promise<Game> {
        const saved = await this.prisma.game.create({
            data: {
                nextMove: game.nextMove,
                status: game.status,
                ownerId: game.ownerId!
            }
        });

        return new Game(saved.id, saved.nextMove ?? undefined, saved.status ?? undefined, saved.ownerId);
    }

    async findByOwnerId(ownerId: number): Promise<Game[]> {
        const games = await this.prisma.game.findMany({
            where: { ownerId }
        });

        return games.map(g => new Game(g.id, g.nextMove ?? undefined, g.status ?? undefined, g.ownerId));
    }
}
