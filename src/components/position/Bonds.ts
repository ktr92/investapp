import {getUSD} from '../../utils/currecyValue'
import {Store} from '../../store'
import {ViewComponent} from '../table/ViewComponent'

export class Bonds extends ViewComponent implements IObjIndexable {
  constructor(public ticker: string, nominal: number, currency: string, options: Store, market = 'TQCB') {
    super(options)
    const moex: IMoexApi = this.options.getters.getMoex()[market].filter(item => item.ticker === ticker)[0]

    this.name = moex.name

    this.currentPrice = moex.price * nominal / 100
    this.dayChange = moex.open - moex.price
    if (market === 'TQOB') {
      this.logo = `https://mybroker.storage.bcs.ru/FinInstrumentLogo/${options.moexList[market].filter((item) => item[0] === ticker)[0][28]}.png`
    } else {
      this.logo = `https://mybroker.storage.bcs.ru/FinInstrumentLogo/${ticker}.png`
    }

    this.initData(currency, moex, nominal)
  }
  public currentPrice: number
  [index: string]: unknown

  async initData(currency: string, moex: IMoexApi, nominal: number) {
    if (currency.length) {
      if (currency === 'USD') {
        this.currentPrice = this.currentPrice * this.options.getters.getCurrency('usd')
      }
    }
  }

  render() {
    return `
    <div class="">
      <a href="#" target="_blank" class="flex items-center">
        <span class="w-auto h-8 mr-3 ">
          <img src=${this.logo} width="40" width="40" height="40" class="min-w-[40px] rounded-full">
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
