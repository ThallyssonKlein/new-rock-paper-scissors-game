import Movement from "../../domain/movement/Movement";
import { MovementValue } from "../../domain/movement/MovementValue";

export default interface IMovementUsecase{
    generateServerMovement(movements: Movement[]): MovementValue
    generateSalt(): string;
    generateHash(move: string, salt: string): string;
}