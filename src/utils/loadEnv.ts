import { config } from "dotenv";

/* 
  Populate process.env with vars from .env and verify required vars are present. 
  Thanks Z for this function.
*/
export function loadEnv(): void {
    config();
    const requiredEnvVars: string[] = [
        "DISCORD_TOKEN",
        "COIN_SYMBOL",
        "COIN_TICKER",
    ];

    const notFound: string[] = [];

    for (const required of requiredEnvVars) {
        if (process.env[required] === undefined) {
            notFound.push(required);
        }
    }

    if (notFound.length > 0) {
        console.warn(
            `Required environment variables '${notFound.join(
                ", "
            )}' are not set. Please consult the README.`
        );
        process.exit(1);
    }
}
