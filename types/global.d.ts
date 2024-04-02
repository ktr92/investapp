
declare interface IObjIndexable {
  [index: string]: unknown
}
interface IState {
  moex: Array<IMoexApi>,
  portfolio: Array<IPortfolio>,
  currentPortfolio?: IPortfolio
}

declare interface IPosition {
  ticker: string,
  type: string,
  buyPrice: number,
  count: number,
  nominal?: number,
  currency?: string,
  myStop?: number,
  options?: IState
}

declare interface IPortfolio {
  id: number,
  name: string,
  depo: number,
  comm: number,
  positions: Array<IPosition>,
  bonds?: Array<IPosition>,
}

declare interface IMoexApi {
  name: string,
  ticker: string,
  price: number,
  open: number
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
