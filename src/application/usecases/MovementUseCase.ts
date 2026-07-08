import { createHash, randomBytes } from "crypto";
import Movement from "../domain/movement/Movement";
import { MovementValue } from "../domain/movement/MovementValue";
import IMovementUsecase from "../posts/inbound/IMovementUsecase";

export default class MovementUsecase implements IMovementUsecase {
    
    generateSalt(): string {
        return randomBytes(16).toString('hex')
    }

    generateHash(move: string, salt: string): string {
        return createHash('sha256').update(`${move}:${salt}`, 'utf8').digest('hex')
    }

    private readonly OPTIONS: MovementValue[] = [
        MovementValue.ROCK,
        MovementValue.PAPER,
        MovementValue.SCISSORS,
    ];

    generateServerMovement(movements: Movement[]): MovementValue {
        if (movements.length > 0) {
            const paperCount = movements.filter(m => m.value === MovementValue.PAPER).length;
            const scissorsCount = movements.filter(m => m.value === MovementValue.SCISSORS).length;
            const rockCount = movements.filter(m => m.value === MovementValue.ROCK).length;

            if (paperCount > rockCount && paperCount > scissorsCount) {
                return MovementValue.SCISSORS;
            } else if (rockCount > paperCount && rockCount > scissorsCount) {
                return MovementValue.PAPER;
            } else {
                return MovementValue.ROCK;
            }
        } else {
            const randomIndex = Math.floor(Math.random() * this.OPTIONS.length);
            return this.OPTIONS[randomIndex];
        }
    }
}