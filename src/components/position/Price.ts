import {ViewComponent} from '../table/ViewComponent';

export class Price extends ViewComponent {
  constructor(public value: number = null) {
    super()
  }

  render() {
    return `
      <div class="">
          <span class="w-auto block mr-3">
          <span class="block font-medium text-gray-900 whitespace-nowrap dark:text-white">${this.value}</span>
          </span>
          <span>
            <span class="block  bg-primary-100 text-slate-400 text-xs font-medium rounded dark:bg-primary-900 dark:text-primary-300">${this.value}</span>
            </span>  
      </div>
    `
  }
}
