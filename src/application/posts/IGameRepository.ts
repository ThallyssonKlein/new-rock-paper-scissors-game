import Game from "../domain/Game";

export default interface IGameRepository {
    save(game: Game): Promise<Game>;
    findByOwnerIdAndGameId(ownerId: number, gameId: number): Promise<Game | null>;
}
