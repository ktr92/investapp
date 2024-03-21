
declare interface IObjIndexable {
  [index: string]: unknown
}

declare interface IPosition {
  ticker: string,
  buyPrice: number,
  count: number,
  myStop: number,
}

declare interface IPortfolio {
  id: number,
  name: string,
  depo: number,
  comm: number,
  positions: Array<IPosition>
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

declare type CallbackFunction = (param?: unknown) => unknown

declare interface IListener {
  [index: string]: Array<CallbackFunction>,
  eventName?: Array<CallbackFunction>,
}
