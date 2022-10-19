import { Client } from "discord.js";
import { Scraper } from "../Scraper";
import log from "electron-log";

export const setStatus = (client: Client, scraper: Scraper) => {
    const newStatus = `24H ${scraper.getDayChange()?.toFixed(2)}%`;
    log.info("set status: " + newStatus);
    client.user?.setPresence({
        activities: [
            {
                name: newStatus,
                type: "WATCHING",
            },
        ],
        status: scraper.getDayChange() > 0 ? "online" : "dnd",
    });
};
