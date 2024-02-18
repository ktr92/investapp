import {ViewComponent} from '../table/ViewComponent'

export class Change extends ViewComponent implements IObjIndexable {
  constructor(public startValue: number, public currentValue: number, public count: number) {
    super()
    this.value = (this.currentValue - this.startValue) * this.count
  }
  public value: number
  [index: string]: unknown

  render() {
    return `
      <div class="">
          <span class="w-auto block mr-3">
          <span class="block font-medium text-gray-900 whitespace-nowrap dark:text-white">${this.value }</span>
          </span>
          <span>
            <span class="block  bg-primary-100 text-slate-400 text-xs font-medium rounded dark:bg-primary-900 dark:text-primary-300">${(this.value / (this.startValue * this.count) * 100).toFixed(2)}%</span>
            </span>  
      </div>
    `
  }
}
