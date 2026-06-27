import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { NextMove } from "../../../../application/domain/game/NexMove";
import { Status } from "../../../../application/domain/game/Status";
import { UserEntity } from "./UserEntity";
import { MovementEntity } from "./MovementEntity";

@Entity("game")
export class GameEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "next_move", type: "enum", enum: NextMove, nullable: true })
    nextMove!: NextMove | null;

    @Column({ name: "status", type: "enum", enum: Status, nullable: true })
    status!: Status | null;

    @Column({ name: "owner_id" })
    ownerId!: number;

    @ManyToOne(() => UserEntity, (user) => user.games)
    @JoinColumn({ name: "owner_id" })
    owner!: UserEntity;

    @OneToMany(() => MovementEntity, (movement) => movement.game)
    movements!: MovementEntity[];
}
