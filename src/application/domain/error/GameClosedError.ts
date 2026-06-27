export default class GameClosedError extends Error {
    constructor(gameId: number) {
        super(`Game ${gameId} is already closed`);
        this.name = "GameClosedError";
    }
}