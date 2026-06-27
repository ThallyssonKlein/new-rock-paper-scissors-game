import { MovementValue } from "./MovementValue";

export default class Movement {
    constructor(
        public id?: number,
        public value?: MovementValue,
        public salt?: string,
        public hash?: string,
        public playerId?: number,
        public gameId?: number,
        public createdAt?: Date
    ) {}
}
