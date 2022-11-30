import axios from "axios";
import log from "electron-log";
import ccxt from "ccxt";

const TICK_TIME = 5000;

export class Scraper {
    private price: number | null = null;
    private dayChange: number | null = null;
    private mcapRank: number | null = null;
    private symbol: string;
    private ticker: string;

    private exchange = new ccxt.kraken();

    public static async create(coinSymbol: string, coinTicker: string) {
        const scraper = new Scraper(coinSymbol, coinTicker);
        await scraper.init();
        return scraper;
    }

    private constructor(symbol: string, ticker: string) {
        this.symbol = symbol;
        this.ticker = ticker;
        this.init();
    }

    public getPrice() {
        return this.price!;
    }

    public getDayChange() {
        return this.dayChange!;
    }

    public getMcapRank() {
        return this.mcapRank!;
    }

    private init = async () => {
        await this.fetchPrice();
        await this.fetchMcap();

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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            log.warn("An error occured fetching mcap: " + err.toString());
        }
    };

    private fetchPrice = async () => {
        try {
            const res = await this.exchange.fetchTicker(`${this.ticker}`);

            console.log(res);

            this.price = res.last || 0;
            this.dayChange = res.percentage || 0;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            log.warn("An error occured getting price info: " + err.toString());
        }
    };
}
