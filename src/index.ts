import { Client, Intents } from "discord.js";
import log from "electron-log";
import { Scraper } from "./Scraper";
import { loadEnv } from "./utils";
import { setName, setStatus } from "./actions";

// load the environment variables
loadEnv();

export const { COIN_SYMBOL, COIN_TICKER, DISCORD_TOKEN } =
    process.env as Record<string, string>;

async function main() {
    // Create a new client instance
    const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

    client.once("ready", async () => {
        log.info("Bot logged in");

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const scraper = await Scraper.create(COIN_SYMBOL, COIN_TICKER);

        log.info("Checking connected guilds...");
        client.guilds.cache.forEach(async (guild) => {
            log.info(`${guild.id} ${guild.name}`);
        });

        setName(client, scraper);
        setStatus(client, scraper);

        setInterval(() => {
            setName(client, scraper);
        }, 20000);
        setInterval(() => {
            setStatus(client, scraper);
        }, 20000);
    });

    client.login(DISCORD_TOKEN);
}

main();
