
declare interface IObjIndexable {
  [index: string]: unknown
}
interface IState {
  moex: IMarketsApi,
  portfolio: Array<IPortfolio>,
  currentPortfolio?: IPortfolio
}

declare interface IMarkets {
  [index: string]: Array<IPosition>,
  TQBR?: Array<IPosition>,
  TQCB?: Array<IPosition>,
  TQOB?: Array<IPosition>
}
declare interface IMarketsApi {
  [index: string]: Array<IMoexApi>,
  TQBR?: Array<IMoexApi>,
  TQCB?: Array<IMoexApi>,
  TQOB?: Array<IMoexApi>
}
declare interface IMarketsList {
  [index: string]: Array<Array<string>>,
  TQBR?: Array<Array<string>>,
  TQCB?: Array<Array<string>>,
  TQOB?: Array<Array<string>>
}

declare interface IPosition {
  ticker: string,
  type: string,
  market: string,
  buyPrice: number,
  count: number,
  nominal?: number,
  currency?: string,
  buyCurrency?: number,
  myStop?: number,
  options?: IState
}

declare interface IPortfolio {
  id: string,
  name: string,
  depo: number,
  comm: number,
  markets: IMarkets,
  defaultSumm: number,
  defaultCategory: string,
}

declare interface IItem {
  ticker: string,
  name: string,
  fullname: string,
  engname: string,
  price: number,
  startPrice: number,
  currency: string,
  nominal: number
}

declare interface IMoexApi {
  name: string,
  ticker: string,
  price: number,
  open: number,
  nominal: number
}

declare interface IListItem {
  id: string,
  text: string,
  type: string
}

declare interface ICurrency {
  id: string,
  value: number
}

declare type CallbackFunction = (param?: unknown) => unknown

declare interface IListener {
  [index: string]: Array<CallbackFunction>,
  eventName?: Array<CallbackFunction>,
}

declare interface IMoexObject {
  [index: string]: IMoexIndex,

}
declare interface IMoexIndex {
  type: string,
  market: string,
  priceIndex_1: number,
  priceIndex_2: number,
  nominalIndex: number,
  currencyIndex: number,
  tickerIndex: number,
  nameIndex: number,
  fnameIndex: number,
  engnameIndex: number,
  openPriceIndex: number,
  nkdIndex: number | null
}
