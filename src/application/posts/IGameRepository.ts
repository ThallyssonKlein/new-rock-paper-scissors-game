import Game from "../domain/Game";

export default interface IGameRepository {
    save(game: Game): Promise<Game>;
    findByOwnerId(ownerId: number): Promise<Game[]>;
}
