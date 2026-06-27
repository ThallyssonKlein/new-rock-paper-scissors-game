import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { MovementValue } from "../../../../application/domain/movement/MovementValue";
import { UserEntity } from "./UserEntity";
import { GameEntity } from "./GameEntity";

@Entity("movement")
export class MovementEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "enum", enum: MovementValue })
    value!: MovementValue;

    @Column({ type: "varchar", length: 32 })
    salt!: string;

    @Column({ type: "varchar", length: 64 })
    hash!: string;

    @Column({ name: "player_id" })
    playerId!: number;

    @ManyToOne(() => UserEntity, (user) => user.movements)
    @JoinColumn({ name: "player_id" })
    player!: UserEntity;

    @Column({ name: "game_id" })
    gameId!: number;

    @ManyToOne(() => GameEntity, (game) => game.movements)
    @JoinColumn({ name: "game_id" })
    game!: GameEntity;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;
}
