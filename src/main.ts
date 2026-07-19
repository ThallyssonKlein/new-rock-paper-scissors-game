import "reflect-metadata";
import { AppDataSource } from "./adapter/outbound/postgresql/AppDataSource";
import Routes from "./adapter/inbound/http/api/Routes";
import GameController from "./adapter/inbound/http/api/v1/controller/GameController";
import AuthController from "./adapter/inbound/http/api/v1/controller/AuthController";
import GameReposityAdapter from "./adapter/outbound/postgresql/GameRepository";
import UserRepository from "./adapter/outbound/postgresql/UserRepository";
import RedisAdapter from "./adapter/outbound/redis/RedisAdapter";
import ScryptPasswordHasher from "./adapter/outbound/security/ScryptPasswordHasher";
import JwtTokenProvider from "./adapter/outbound/security/JwtTokenProvider";
import StartGameUseCase from "./application/usecases/StartGameUseCase";
import AuthUsecase from "./application/usecases/AuthUsecase";

AppDataSource.initialize().then(() => {
    const gameRepository = new GameReposityAdapter();
    const userRepository = new UserRepository();
    const redisAdapter = new RedisAdapter();
    const passwordHasher = new ScryptPasswordHasher();
    const tokenProvider = new JwtTokenProvider();

    const gameUseCase = new StartGameUseCase(gameRepository, redisAdapter);
    const authUsecase = new AuthUsecase(userRepository, passwordHasher, tokenProvider);

    const gameController = new GameController(gameUseCase);
    const authController = new AuthController(authUsecase);

    const routes = new Routes(gameController, authController, tokenProvider);

    routes.setupRouter();
}).catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
});
