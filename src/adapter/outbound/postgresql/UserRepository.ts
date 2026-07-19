import { Repository } from "typeorm";
import { AppDataSource } from "./AppDataSource";
import { UserEntity } from "./entities/UserEntity";
import User from "../../../application/domain/user/User";
import IUserRepository from "../../../application/posts/outbound/postgresql/IUserRepository";

export default class UserRepository implements IUserRepository {
    private repository: Repository<UserEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(UserEntity);
    }

    async findByUsername(username: string): Promise<User | null> {
        const entity = await this.repository.findOne({ where: { username } });
        if (!entity) return null;
        return new User(entity.id, entity.username, entity.passwordHash);
    }

    async save(user: User): Promise<User> {
        const entity = this.repository.create({
            username: user.username!,
            passwordHash: user.passwordHash!,
        });

        const saved = await this.repository.save(entity);

        return new User(saved.id, saved.username, saved.passwordHash);
    }
}
