import Game from "../../domain/game/Game";

export default interface IStartGameUsecase {
    startGame(game: Game): Promise<Game>
}