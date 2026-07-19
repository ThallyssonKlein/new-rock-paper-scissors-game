export type TokenPayload = {
    id: number;
};

export default interface ITokenProvider {
    sign(payload: TokenPayload): string;
    verify(token: string): TokenPayload;
}
