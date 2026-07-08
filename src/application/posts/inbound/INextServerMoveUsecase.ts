export default interface INextServerMoveUsecase {
    nextServerMove(gameId: number, userId: number, traceId: string): Promise<void>
}