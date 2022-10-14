import axios from "axios";
import log from "electron-log";
import ccxt from "ccxt";
import { COIN_TICKER } from ".";

const TICK_TIME = 1000;

export class Scraper {
    private price: number | null = null;
    private dayChange: number | null = null;
    private mcapRank: number | null = null;
    private symbol: string;

    private exchange = new ccxt.binance();

    constructor(symbol: string) {
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
        }, TICK_TIME);
        setInterval(() => {
            this.fetchMcap();
        }, TICK_TIME * 100);
    };

    private fetchMcap = async () => {
        try {
            const res = await axios.get(
                `https://api.coingecko.com/api/v3/coins/${this.symbol}`
            );
            this.mcapRank = res.data.market_data.market_cap_rank;
        } catch (err: any) {
            log.warn("An error occured fetching mcap: " + err.toString());
        }
    };

    private fetchPrice = async () => {
        try {
            const res = await this.exchange.fetchTicker(`${COIN_TICKER}USDT`);
            this.price = res.last || 0;
            this.dayChange = res.percentage || 0;
        } catch (err: any) {
            log.warn("An error occured getting price info: " + err.toString());
        }
    };
}
