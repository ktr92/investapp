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
      type: string,
      buyPrice: number,
      count: number,
      nominal: number,
      currency: string,
      myStop: number = null,
      salePrice: number = null,
      options: Store
  ) {
    this.options = options
    this.type = type
    if (this.type === 'stock') {
      this.stock = new Stock(ticker, options )
    }
    if (this.type === 'bonds') {
      this.stock = new Bonds(ticker, nominal, currency, options )
    }
    this.startPrice = new Price(buyPrice, options )
    this.count = new Count(count, options)
    this.startTotal = new Totalprice(buyPrice, count, options )
    this.currentPrice = new Totalprice(this.stock.currentPrice, count, options)
    this.change = new Change(buyPrice, this.stock.currentPrice, count, options)
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

  static createPosition(items: Array<IPosition>, state: Store, type: string) {
    const result = items.map((item: IPosition) => {
      return new Position(item.ticker, type, item.buyPrice, item.count, item.nominal, item.currency, item.myStop, null, state)
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
