import {Stock} from './Stock';

export class Position implements IObjIndexable {
  constructor(
    public name: string,
    public ticker:string,
    public buyPrice: number,
    public myStop: number = null,
    public salePrice: number = null,
  ) {
    this.init()
  }

  [index: string]: unknown;

  public stock: Stock

  init() {
    this.stock = new Stock(this.ticker)
  }
}
