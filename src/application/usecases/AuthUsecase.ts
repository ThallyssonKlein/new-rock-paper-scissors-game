import Logger from "../../adapter/outbound/logging/Logger";
import User from "../domain/user/User";
import IUserRepository from "../posts/outbound/postgresql/IUserRepository";
import IPasswordHasher from "../posts/outbound/security/IPasswordHasher";
import ITokenProvider from "../posts/outbound/security/ITokenProvider";
import IAuthUsecase from "../posts/inbound/IAuthUsecase";
import UserAlreadyExistsError from "../domain/error/UserAlreadyExistsError";
import InvalidCredentialsError from "../domain/error/InvalidCredentialsError";

export default class AuthUsecase implements IAuthUsecase {
    private logger: Logger;

    constructor(
        private userRepository: IUserRepository,
        private passwordHasher: IPasswordHasher,
        private tokenProvider: ITokenProvider,
    ) {
        this.logger = new Logger("AuthUsecase");
    }

    async register(username: string, password: string): Promise<string> {
        const existing = await this.userRepository.findByUsername(username);
        if (existing) {
            this.logger.warn(`Username already taken: ${username}`);
            throw new UserAlreadyExistsError(username);
        }

        const passwordHash = await this.passwordHasher.hash(password);
        const saved = await this.userRepository.save(new User(undefined, username, passwordHash));
        this.logger.info(`User registered: ${saved.id}`);

        return this.tokenProvider.sign({ id: saved.id! });
    }

    async login(username: string, password: string): Promise<string> {
        const user = await this.userRepository.findByUsername(username);
        if (!user || !user.passwordHash) {
            this.logger.warn(`Login failed, user not found: ${username}`);
            throw new InvalidCredentialsError();
        }

        const matches = await this.passwordHasher.compare(password, user.passwordHash);
        if (!matches) {
            this.logger.warn(`Login failed, wrong password: ${username}`);
            throw new InvalidCredentialsError();
        }

        this.logger.info(`User logged in: ${user.id}`);
        return this.tokenProvider.sign({ id: user.id! });
    }
}
