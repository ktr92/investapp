import {Change} from './Change';
import {Price} from './Price';
import {Stock} from './Stock';
import {Count} from './Count';
import {Totalprice} from './Totalprice';

export class Position implements IObjIndexable {
  constructor(
      ticker:string,
      buyPrice: number,
      count: number,
      myStop: number = null,
      salePrice: number = null,
  ) {
    this.stock = new Stock(ticker)
    this.startPrice = new Price(buyPrice)
    this.count = new Count(count)
    this.startTotal = new Totalprice(buyPrice, count)
    this.currentPrice = new Totalprice(this.stock.currentPrice, count)
    this.change = new Change(buyPrice, this.stock.currentPrice, count)
    this.myStop = new Price(myStop)
    this.salePrice = new Totalprice(salePrice)
  }

  [index: string]: unknown;

  public stock: Stock
  public price: Price
  public change: Change
  public startPrice: Price
  public currentPrice: Totalprice
}
