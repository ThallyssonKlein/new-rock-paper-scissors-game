export default class NextServerMoveUseCase {
    async nextServerMove(gameId: number, userId: number, traceId: string) {
        const isOwner = await this.verifyOwner(gameId, userId)

        if (!isOwner) {
            this.logger.warn("Invalid Game Owner, userId: " + userId + " gameId: " + gameId, traceId)
            throw new InvalidGameOwnerError(userId, gameId)
        }

        const game = await this.gameRepository.findByOwnerIdAndGameId(userId, gameId)

        if (!game || !game.id) {
            this.logger.error('Invalid game!', traceId)
            throw new Error('Invalid Game!')
        }

        if (game.status !== Status.OPENED) {
            this.logger.warn("GameClosedError: gameId: " + gameId, traceId)
            throw new GameClosedError(game.id)
        }

        const turn = await this.redisAdapter.get('turn:' + gameId)
        if (turn !== 'server') {
            throw new PlayerTurnError(gameId)
        }

    }

    private async verifyOwner(gameId: number, userId: number) {
        const resultFromCache = await this.redisAdapter.get(`game_${gameId}_owner`)

        if (resultFromCache) {
            return true;
        }

        const resultFromDB = await this.gameRepository.findByOwnerIdAndGameId(userId, gameId);

        if (!resultFromDB) {
            return false
        }

        await this.redisAdapter.set(`game_:${gameId}_owner`, userId + '', this.ONE_DAY);

        return true;
    }
}