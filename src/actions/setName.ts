import { Client } from "discord.js";
import { Scraper } from "../Scraper";
import { numberWithCommas, rankToChar } from "../utils";
import log from "electron-log";
import { DECIMALS } from "..";

export const setName = (client: Client, scraper: Scraper) => {
    client.guilds.cache.forEach(async (guild) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const user = await guild.members.fetch(client.user!.id);
        const newNick = `${rankToChar(
            scraper.getMcapRank() || 0
        )} $${numberWithCommas(scraper.getPrice() || 0, Number(DECIMALS))}`;
        log.info(guild.id + " setName: " + newNick);
        try {
            user.setNickname(newNick);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            log.error(err.toString());
        }
    });
};
