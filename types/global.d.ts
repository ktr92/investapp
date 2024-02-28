
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
