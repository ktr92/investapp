import {Stock} from './Stock';

export class Portfolio {
  constructor(public name: string, public stocks: Array<Stock> = []) {}

  buyStock(stock: Stock) {
    this.stocks.push(stock)
  }
}
