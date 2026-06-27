import { NextMove } from "./NexMove";
import { Status } from "./Status";

export default class Game {
    constructor(
        public id?: number,
        public nextMove?: NextMove,
        public status?: Status,
        public ownerId?: number
    ) {}
}
