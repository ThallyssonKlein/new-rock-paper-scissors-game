import Routes from "./adapter/inbound/http/api/Routes";
import GameController from "./adapter/inbound/http/api/v1/controller/GameController";
import GameReposityAdapter from "./adapter/outbound/postgresql/GameRepository";
import GameUseCase from "./application/usecases/GameUsecase";

const gameRepository = new GameReposityAdapter();

const gameUseCase = new GameUseCase(gameRepository)

const gameController = new GameController(gameUseCase)

const routes = new Routes(gameController)

routes.setupRouter();