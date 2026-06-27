export default class InvalidGameOwnerError extends Error {
    constructor(userId: number, gameId: number) {
        super(`User ${userId} is not the owner of game ${gameId}`);
        this.name = "InvalidGameOwner";
    }
}