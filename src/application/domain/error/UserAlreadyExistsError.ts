export default class UserAlreadyExistsError extends Error {
    constructor(username: string) {
        super(`Username ${username} is already taken`);
        this.name = "UserAlreadyExists";
    }
}
