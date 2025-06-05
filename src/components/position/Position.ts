import {Change} from './Change';
import {Price} from './Price';
import {Stock} from './Stock';
import {Count} from './Count';
import {Totalprice} from './Totalprice';
import {Store} from '../../store/moex';
import {Bonds} from './Bonds';
import {PositionControl} from './PositionControl';

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
      nkd = 0,
      comm = 1,
      options: Store,
      positionId: string,
      portfolioId: string,
      marketId: string
  ) {
    this.options = options
    this.type = type

    if (this.type === 'stock') {
      this.stock = new Stock(ticker, options, market )
    }
    if (this.type === 'bonds') {
      this.stock = new Bonds(ticker, nominal, currency, options, market )
    }

    buyPrice = buyPrice * (nominal ? (nominal / 100) : 1) * (buyCurrency ? buyCurrency : 1)
    this.startPrice = new Price(buyPrice, options )
    this.change = new Change(buyPrice, this.stock.currentPrice, count, options)
    this.nominal = nominal
    this.count = new Count(count, options)
    this.currentPrice = new Totalprice(this.stock.currentPrice, count, options)
    this.myStop = new Price(myStop, options )
    this.salePrice = new Totalprice(salePrice, null, options )

    this.comm = this.startPrice.value * count * comm / 100
    this.nkd = nkd * count

    const extra = Number(nkd * count + Number(this.comm))
    this.comm = new Price(this.comm as number, options)
    this.nkd = new Price(this.nkd as number, options)

    this.startTotal = new Totalprice(buyPrice, count, options, extra)

    this.positionControl = new PositionControl({
      positionId,
      portfolioId,
      marketId
    }, options)
  }

  [index: string]: unknown;

  public stock: Stock
  public price: Price
  public change: Change
  public startPrice: Price
  public currentPrice: Totalprice
  public options: Store

  static createPosition(items: Array<IPosition>, state: Store, type: string, comm: number, market: string) {
    const result: Array<Position> = []
    items.forEach((item: IPosition) => {
      // выводим все кроме проданных
      if (!item.isSold) {
        result.push(new Position(
            item.ticker,
            market,
            type,
            item.buyPrice,
            item.count,
            item.nominal,
            item.currency,
            item.buyCurrency,
            item.myStop,
            null,
            item.nkd,
            comm,
            state,
            item.positionId,
            item.portfolioId,
            market))
      }
    })

    return result
  }
}
