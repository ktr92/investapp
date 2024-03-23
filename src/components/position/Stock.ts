import {ViewComponent} from '../table/ViewComponent'
interface IState {
  moex: Array<IMoexApi>
}
export class Stock extends ViewComponent implements IObjIndexable {
  constructor(public ticker: string, options: IState) {
    super(options)

    const moex: IMoexApi = options.moex.filter(item => item.ticker === ticker)[0]

    this.name = moex.name
    this.currentPrice = moex.price
    this.dayChange = moex.open - moex.price
    this.logo = `https://mybroker.storage.bcs.ru/FinInstrumentLogo/${ticker}.png`
  }
  public currentPrice: number
  [index: string]: unknown

  render() {
    return `
    <div class="">
      <a href="#" target="_blank" class="flex items-center">
        <span class="w-auto h-8 mr-3">
          <img src=${this.logo} width="40" height="40">
        </span>
        <span>
          <span class="block font-medium text-gray-900 whitespace-nowrap dark:text-white">${this.name}</span>
          <span class="block  bg-primary-100 text-slate-400 text-xs font-medium rounded dark:bg-primary-900 dark:text-primary-300">${this.ticker}</span>
          </span>  
      </a>
    </div>
  `
  }
}
