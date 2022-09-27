import axios from "axios";
import { EventEmitter } from "stream";
import { COIN_SYMBOL } from ".";

export class Scraper extends EventEmitter {
    private gasPrice: number | null = null;
    private price: number | null = null;
    private symbol: string;

    constructor(symbol: string) {
        super();
        this.symbol = symbol;
        this.init();
    }

    public getPrice() {
        return this.price;
    }

    public getGasPrice() {
        return this.gasPrice;
    }

    private init = async () => {
        this.fetchPrice();
        setInterval(() => {
            this.fetchPrice();
        }, 10000);
    };

    private fetchPrice = async () => {
        const res = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${this.symbol}&vs_currencies=usd`
        );
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (this.price !== res.data[COIN_SYMBOL!].usd) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.price = res.data[COIN_SYMBOL!].usd;
            this.emit("newPrice", this.price);
        }
    };
}
