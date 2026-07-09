import { MovementValue } from "./MovementValue";

export default interface Movement {
    id: number;
    value: MovementValue;
    salt: string;
    hash: string;
    playerId: number;
    gameId: number;
    createdAt: Date;
}
