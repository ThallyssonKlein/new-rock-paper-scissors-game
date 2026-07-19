import User from "../../../domain/user/User";

export default interface IUserRepository {
    findByUsername(username: string): Promise<User | null>;
    save(user: User): Promise<User>;
}
