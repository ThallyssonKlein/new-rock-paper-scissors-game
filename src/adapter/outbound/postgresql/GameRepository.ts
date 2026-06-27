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

    async findByOwnerIdAndGameId(ownerId: number, gameId: number): Promise<Game | null> {
        const game = await this.prisma.game.findFirst({
            where: { ownerId, id: gameId }
        });

        if (!game) return null;
        return new Game(game.id, game.nextMove ?? undefined, game.status ?? undefined, game.ownerId);
    }
}
