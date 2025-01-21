import {Store} from '../../store'
import {ViewComponent} from '../table/ViewComponent'

export class Bonds extends ViewComponent implements IObjIndexable {
  constructor(public ticker: string, nominal: number, currency: string, options: Store, market: string) {
    super(options)
    const moex: IMoexApi = this.options.getters.getMoex()[market].filter(item => item.ticker === ticker)[0]
    this.name = moex.name

    this.currentPrice = moex.price * moex.nominal / 100
    this.dayChange = moex.open - moex.price
    if (market === 'TQOB') {
      this.logo = `https://mybroker.storage.bcs.ru/FinInstrumentLogo/${options.moexSecurities[market].filter((item) => item[0] === ticker)[0][28]}.png`
    } else {
      this.logo = `https://mybroker.storage.bcs.ru/FinInstrumentLogo/${ticker}.png`
    }

    this.initData(currency, moex, nominal)
  }
  public currentPrice: number
  [index: string]: unknown

  async initData(currency: string, moex: IMoexApi, nominal: number) {
    if (currency && currency.length) {
      const curVal = this.options.getters.getCurrency(currency)
      if (curVal) {
        this.currentPrice = this.currentPrice * this.options.getters.getCurrency(currency)
      }
    }
  }

  render() {
    return `
    <div class="">
      <a href="#" target="_blank" class="flex items-center">
        <span class="w-auto h-8 mr-3 ">
          <img src=${this.logo} width="22" width="22" height="22" class="min-w-[22px] rounded-full">
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
