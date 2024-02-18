import {ViewComponent} from '../table/ViewComponent'

export class Totalprice extends ViewComponent {
  constructor(public single: number = null, public count: number = null) {
    super()
    this.total = this.single * this.count
  }

  public total: number

  render() {
    return `
      <div class="">
          <span class="w-auto block mr-3">
          <span class="block font-medium text-gray-900 whitespace-nowrap dark:text-white">${this.total ? this.total + '₽' : ''}</span>          </span>
          <span>
            <span class="block  bg-primary-100 text-slate-400 text-xs font-medium rounded dark:bg-primary-900 dark:text-primary-300">${this.single} ₽</span>
            </span>  
      </div>
    `
  }
}
