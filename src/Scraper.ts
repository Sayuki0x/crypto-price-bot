import axios from "axios";
import { EventEmitter } from "stream";
import log from "electron-log";
import ccxt from "ccxt";
import { COIN_TICKER } from ".";

export class Scraper extends EventEmitter {
    private price: number | null = null;
    private dayChange: number | null = null;
    private mcapRank: number | null = null;
    private symbol: string;

    private exchange = new ccxt.binance();

    constructor(symbol: string) {
        super();
        this.symbol = symbol;
        this.init();
    }

    public getPrice() {
        return this.price;
    }

    public getDayChange() {
        return this.dayChange;
    }

    public getMcapRank() {
        return this.mcapRank;
    }

    private init = async () => {
        this.fetchPrice();
        this.fetchMcap();
        setInterval(() => {
            this.fetchPrice();
        }, 10000);
        setInterval(() => {
            this.fetchMcap();
        }, 10000);
    };

    private fetchMcap = async () => {
        const res = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${this.symbol}`
        );
        const mcapRank: number = res.data.market_data.market_cap_rank;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (this.mcapRank !== mcapRank) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.mcapRank = mcapRank;
            this.emit("newMcapRank", this.mcapRank);
        }
    };

    private fetchPrice = async () => {
        try {
            const res = await this.exchange.fetchTicker(`${COIN_TICKER}USDT`);

            const price = res.last || 0;
            const dayChange = res.percentage || 0;

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (this.price !== price) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.price = price;
                this.emit("newPrice", this.price);
            }

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (this.dayChange !== dayChange) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.dayChange = dayChange;
                this.emit("newDayChange", this.dayChange);
            }
        } catch (err) {
            log.warn((err as any).toString());
        }
    };
}
