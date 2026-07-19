import Movement from "../../domain/movement/Movement";

export default interface INextServerMoveUsecase {
    nextServerMove(gameId: number, userId: number, traceId: string): Promise<Movement>
}