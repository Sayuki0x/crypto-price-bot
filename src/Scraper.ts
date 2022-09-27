import axios from "axios";
import { EventEmitter } from "stream";
import log from "electron-log";

export class Scraper extends EventEmitter {
    private price: number | null = null;
    private dayChange: number | null = null;

    private symbol: string;

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

    private init = async () => {
        this.fetchPrice();
        setInterval(() => {
            this.fetchPrice();
        }, 10000);
    };

    private fetchPrice = async () => {
        try {
            const res = await axios.get(
                `https://api.coingecko.com/api/v3/coins/${this.symbol}`
            );

            const price: number = res.data.market_data.current_price.usd;
            const dayChange: number =
                res.data.market_data.price_change_percentage_24h;

            console.log(dayChange);

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
