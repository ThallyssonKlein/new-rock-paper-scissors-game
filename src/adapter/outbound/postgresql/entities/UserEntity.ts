import { Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { GameEntity } from "./GameEntity";
import { MovementEntity } from "./MovementEntity";

@Entity("user")
export class UserEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToMany(() => GameEntity, (game) => game.owner)
    games!: GameEntity[];

    @OneToMany(() => MovementEntity, (movement) => movement.player)
    movements!: MovementEntity[];
}
