import winston from "winston";

const winstonLogger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}] ${message}`)
    ),
    transports: [new winston.transports.Console()],
});

export default class Logger {
    constructor(private readonly prefix: string) {}

    public error(message: string, traceId?: string, error?: unknown) {
        const meta = error instanceof Error ? { stack: error.stack } : error ? { error } : undefined;
        winstonLogger.error(this.format(message, traceId), meta);
    }

    public warn(message: string, traceId?: string, meta?: unknown) {
        winstonLogger.warn(this.format(message, traceId), meta ? { meta } : undefined);
    }

    public info(message: string, traceId?: string, meta?: unknown) {
        winstonLogger.info(this.format(message, traceId), meta ? { meta } : undefined);
    }

    private format(message: string, traceId?: string): string {
        const trace = traceId ? `[${traceId}] ` : "";
        return `[${this.prefix}] ${trace}${message}`;
    }
}
