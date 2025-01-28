import numberWithSpaces from '../../utils/formatNumber'
import {ViewComponent} from '../table/ViewComponent'
import {Store} from '../../store/moex';

export class Totalprice extends ViewComponent {
  constructor(public single: number = null, public count: number = null, options: Store, extra = 0) {
    super(options)
    this.value = this.single * this.count

    if (extra) {
      this.value += extra
    }

    this.value = Number(this.value.toFixed(2))
  }

  public value: number

  render() {
    return `
      <div class="">
          <span class="w-auto block mr-3">
          <span class="block font-medium text-gray-900 whitespace-nowrap dark:text-white">${this.value ? numberWithSpaces(this.value) + ' ₽' : ''}</span>          </span>
          <span>
            <span class="block  bg-primary-100 text-slate-400 text-xs font-medium rounded dark:bg-primary-900 dark:text-primary-300">${numberWithSpaces(this.single.toFixed(2))} ₽</span>
            </span>  
      </div>
    `
  }
}
