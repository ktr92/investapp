import {Change} from './Change';
import {Price} from './Price';
import {Stock} from './Stock';
import {Count} from './Count';
import {Totalprice} from './Totalprice';
import {Store} from '../../store';
import {Bonds} from './Bonds';

export class Position implements IObjIndexable {
  constructor(
      ticker:string,
      market: string,

      type: string,
      buyPrice: number,
      count: number,
      nominal: number,
      currency: string,
      buyCurrency: number,

      myStop: number = null,
      salePrice: number = null,
      options: Store
  ) {
    this.options = options
    this.type = type
    if (this.type === 'stock') {
      this.stock = new Stock(ticker, options, market )
      this.startPrice = new Price(buyPrice, options )
      this.startTotal = new Totalprice(buyPrice, count, options )
      this.change = new Change(buyPrice, this.stock.currentPrice, count, options)
    }
    if (this.type === 'bonds') {
      this.stock = new Bonds(ticker, nominal, currency, options, market )
      let price = buyPrice * nominal / 100
      if (buyCurrency) {
        price *= buyCurrency
      }
      this.startPrice = new Price(price, options )
      this.startTotal = new Totalprice(price, count, options )
      this.change = new Change(price, this.stock.currentPrice, count, options)
    }
    this.count = new Count(count, options)
    this.currentPrice = new Totalprice(this.stock.currentPrice, count, options)
    this.myStop = new Price(myStop, options )
    this.salePrice = new Totalprice(salePrice, null, options )
  }

  [index: string]: unknown;

  public stock: Stock
  public price: Price
  public change: Change
  public startPrice: Price
  public currentPrice: Totalprice
  public options: Store

  static createPosition(items: Array<IPosition>, state: Store, type: string, market = 'TQBR') {
    const result = items.map((item: IPosition) => {
      return new Position(item.ticker, market, type, item.buyPrice, item.count, item.nominal, item.currency, item.buyCurrency, item.myStop, null, state)
    })

    return result
  }

/*   static createTotalPositions(items: Array<Portfolio>) {
    const allPositions: Array<Position> = []
    items.forEach((portf) => {
      portf.positions.forEach((item: Position) => {
        allPositions.push(new Position(item.ticker, item.buyPrice, item.count, item.myStop))
      })
    })
    return allPositions
  } */
}
