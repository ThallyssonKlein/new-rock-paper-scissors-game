import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { GameEntity } from "./GameEntity";
import { MovementEntity } from "./MovementEntity";

@Entity("user")
export class UserEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    username!: string;

    @Column({ name: "password_hash" })
    passwordHash!: string;

    @OneToMany(() => GameEntity, (game) => game.owner)
    games!: GameEntity[];

    @OneToMany(() => MovementEntity, (movement) => movement.player)
    movements!: MovementEntity[];
}
