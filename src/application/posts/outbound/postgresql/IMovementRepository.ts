import Movement from "../../../domain/movement/Movement";

export default interface IMovementRepository {
    findAllMovementsFromOnePlayer(playerId: number): Promise<Movement[]>
}