import Game from "../../domain/Game";

export default interface IGameUsecase {
    startGame(game: Game): Promise<Game>
}