import {Change} from './Change';
import {Price} from './Price';
import {Stock} from './Stock';

export class Position implements IObjIndexable {
  constructor(
    protected name: string,
    protected ticker:string,
    protected buyPrice: number,
    protected count: number,
    protected myStop: number = null,
    protected salePrice: number = null,
  ) {
    this.init()
  }

  [index: string]: unknown;

  public stock: Stock
  public price: Price
  public change: Change

  init() {
    this.stock = new Stock(this.ticker)
    this.startPrice = new Price(this.buyPrice, this.count)
    this.currentPrice = new Price(this.stock.currentPrice, this.count)
    this.change = new Change(this.buyPrice, this.stock.currentPrice)
  }
}
