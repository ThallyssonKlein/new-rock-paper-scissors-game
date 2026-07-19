import jwt, { SignOptions } from "jsonwebtoken";
import ITokenProvider, { TokenPayload } from "../../../application/posts/outbound/security/ITokenProvider";

export default class JwtTokenProvider implements ITokenProvider {
    private readonly secret: string;
    private readonly expiresIn: string;

    constructor() {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        this.secret = process.env.JWT_SECRET;
        this.expiresIn = process.env.JWT_EXPIRES_IN || "1d";
    }

    sign(payload: TokenPayload): string {
        return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn } as SignOptions);
    }

    verify(token: string): TokenPayload {
        return jwt.verify(token, this.secret) as TokenPayload;
    }
}
