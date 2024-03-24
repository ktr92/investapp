import numberWithSpaces from '../../utils/formatNumber'
import {ViewComponent} from '../table/ViewComponent'
import {Store} from '../../store';
export class Change extends ViewComponent implements IObjIndexable {
  constructor(public startValue: number, public currentValue: number, public count: number, options: Store) {
    super(options)
    this.value = Number(((this.currentValue - this.startValue) * this.count).toFixed(2))
    this.percent = Number(((this.value / (this.startValue * this.count) * 100)).toFixed(2))
  }
  public value: number
  public percent: number
  [index: string]: unknown

  render() {
    return `
      <div class="">
          <span class="w-auto block mr-3">
          <span class="block font-medium text-gray-900 whitespace-nowrap dark:text-white ${this.value > 0 ? 'text-green-500' : 'text-red-500'}">${numberWithSpaces(this.value) }</span>
          </span>
          <span>
            <span class="block  bg-primary-100 text-xs font-medium rounded dark:bg-primary-900 dark:text-primary-300 ${this.percent > 0 ? 'text-green-500' : 'text-red-500'}">${numberWithSpaces(this.percent)}%</span>
            </span>  
      </div>
    `
  }
}
