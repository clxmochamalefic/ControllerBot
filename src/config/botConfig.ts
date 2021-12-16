import "dotenv/config"

type BotConfig = {
  prefix: string  /** Prefix used for bot commands. */
};

const config: BotConfig = {
  prefix: process.env.CMD_PREFIX || "!scb"
};

export default config;
