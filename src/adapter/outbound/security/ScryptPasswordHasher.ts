import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import IPasswordHasher from "../../../application/posts/outbound/security/IPasswordHasher";

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

export default class ScryptPasswordHasher implements IPasswordHasher {
    async hash(plain: string): Promise<string> {
        const salt = randomBytes(16).toString("hex");
        const derived = (await scryptAsync(plain, salt, KEY_LENGTH)) as Buffer;
        return `${salt}:${derived.toString("hex")}`;
    }

    async compare(plain: string, stored: string): Promise<boolean> {
        const [salt, key] = stored.split(":");
        if (!salt || !key) return false;

        const derived = (await scryptAsync(plain, salt, KEY_LENGTH)) as Buffer;
        const keyBuffer = Buffer.from(key, "hex");

        if (keyBuffer.length !== derived.length) return false;
        return timingSafeEqual(keyBuffer, derived);
    }
}
