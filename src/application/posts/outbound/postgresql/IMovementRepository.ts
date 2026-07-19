import Movement from "../../../domain/movement/Movement";

export default interface IMovementRepository {
    findAllMovementsFromOnePlayer(playerId: number): Promise<Movement[]>
    saveMovement(movement: Omit<Movement, 'id' | 'createdAt'>): Promise<Movement>
}