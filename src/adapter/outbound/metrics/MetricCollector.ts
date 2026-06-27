import StatsD from "hot-shots";

export default class MetricCollector {
    private client: StatsD;

    constructor(
        host: string = process.env.DD_AGENT_HOST ?? "localhost",
        port: number = Number(process.env.DD_DOGSTATSD_PORT ?? 8125)
    ) {
        this.client = new StatsD({
            host,
            port,
            prefix: "rps_game.",
            globalTags: { env: process.env.NODE_ENV ?? "development" },
            errorHandler: (error) => {
                console.error("[MetricCollector] StatsD error:", error);
            },
        });
    }

    increment(metric: string, tags?: string[]): void {
        this.client.increment(metric, 1, tags);
    }

    decrement(metric: string, tags?: string[]): void {
        this.client.decrement(metric, 1, tags);
    }

    gauge(metric: string, value: number, tags?: string[]): void {
        this.client.gauge(metric, value, tags);
    }

    histogram(metric: string, value: number, tags?: string[]): void {
        this.client.histogram(metric, value, tags);
    }

    timing(metric: string, durationMs: number, tags?: string[]): void {
        this.client.timing(metric, durationMs, tags);
    }

    close(): void {
        this.client.close();
    }
}
