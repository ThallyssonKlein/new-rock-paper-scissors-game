import dotenv from "dotenv";

type IConfig = {
  env: string;
  port: number;
  playerIdServer: number;
};

export default class Config {
  private config: IConfig;

  constructor() {
    if (!process.env.NODE_ENV) {
      throw new Error("NODE_ENV is not defined");
    }

    const envFile = process.env.NODE_ENV === 'production' ? '.env.production' :
                    process.env.NODE_ENV === 'development-docker' ? '.env.development-docker' :
                    process.env.NODE_ENV === 'test' ? '.env.test' : '.env.development';
    dotenv.config({ path: envFile });

    if (!process.env.PLAYER_ID_SERVER) {
      throw new Error("PLAYER_ID_SERVER is not defined");
    }

    if (!process.env.PLAYER_ID_SERVER) {
      throw new Error("PLAYER_ID_SERVER is not defined");
    }

    this.config = {
      env: process.env.NODE_ENV,
      port: parseInt(process.env.PORT || "3000"),
      playerIdServer: process.env.PLAYER_ID_SERVER
    };
  }

  getConfig() {
    return this.config;
  }
}
