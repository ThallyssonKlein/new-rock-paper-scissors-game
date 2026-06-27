import "reflect-metadata";
import { AppDataSource } from "./adapter/outbound/postgresql/AppDataSource";
import Routes from "./adapter/inbound/http/api/Routes";
import GameController from "./adapter/inbound/http/api/v1/controller/GameController";
import GameReposityAdapter from "./adapter/outbound/postgresql/GameRepository";
import RedisAdapter from "./adapter/outbound/redis/RedisAdapter";
import StartGameUseCase from "./application/usecases/StartGameUseCase";

AppDataSource.initialize().then(() => {
    const gameRepository = new GameReposityAdapter();
    const redisAdapter = new RedisAdapter();

    const gameUseCase = new StartGameUseCase(gameRepository, redisAdapter);

    const gameController = new GameController(gameUseCase);

    const routes = new Routes(gameController);

    routes.setupRouter();
}).catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
});
