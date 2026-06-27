export default class PlayerTurnError extends Error {
    constructor(gameId: number) {
        super(`Game ${gameId} is waiting for the player's move`);
        this.name = "PlayerTurnError";
    }
}
