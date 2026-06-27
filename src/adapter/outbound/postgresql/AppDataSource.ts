import "reflect-metadata";
import { DataSource } from "typeorm";
import { UserEntity } from "./entities/UserEntity";
import { GameEntity } from "./entities/GameEntity";
import { MovementEntity } from "./entities/MovementEntity";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: [UserEntity, GameEntity, MovementEntity],
    synchronize: false,
    logging: false,
});
