import { Client, Intents } from "discord.js";
import log from "electron-log";
import { Scraper } from "./Scraper";
import { loadEnv } from "./utils/loadEnv";
import { numberWithCommas } from "./utils/numberWithCommas";
import { sleep } from "./utils/sleep";

// load the environment variables
loadEnv();

export const { COIN_SYMBOL, COIN_TICKER, DISCORD_TOKEN } = process.env;

const rankToChar = (n: number) => {
    switch (n) {
        case 1:
            return "♚";
        case 2:
            return "♛";
        default:
            if (n >= 3 && n < 11) {
                return "♜";
            }
            if (n >= 11 && n < 100) {
                return "♞";
            }
            return "♟";
    }
};

async function main() {
    // Create a new client instance
    const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

    client.once("ready", async () => {
        log.info("Bot logged in");

        const actions: Array<() => void> = [];
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const scraper = new Scraper(COIN_SYMBOL!);

        const setStatus = () => {
            actions.push(async () => {
                const newStatus = `24H ${scraper.getDayChange()?.toFixed(2)}%`;
                log.info("set status: " + newStatus);
                client.user?.setPresence({
                    activities: [
                        {
                            name: newStatus,
                            type: "WATCHING",
                        },
                    ],
                });
            });
        };

        const setName = () => {
            client.guilds.cache.forEach(async (guild) => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const user = await guild.members.fetch(client.user!.id);
                actions.push(async () => {
                    const newNick = `${rankToChar(
                        scraper.getMcapRank() || 0
                    )} $${numberWithCommas(scraper.getPrice() || 0)}`;
                    log.info(guild.id + " setName: " + newNick);
                    try {
                        user.setNickname(newNick);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } catch (err: any) {
                        log.error(err.toString());
                    }
                });
            });
        };

        scraper.on("newPrice", setName);
        scraper.on("newDayChange", setStatus);
        scraper.on("newMcapRank", setName);

        const processActions = async () => {
            // eslint-disable-next-line no-constant-condition
            while (true) {
                if (actions.length > 0) {
                    const action = actions.pop() as () => void;
                    action();
                    log.info("Processed action");
                }
                await sleep(1000);
            }
        };
        processActions();
    });

    client.login(DISCORD_TOKEN);
}

main();
