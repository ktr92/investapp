import {Price} from '../position/Price';
import {TableComponent} from './TableComponent';

export class TablePrice extends TableComponent {
  constructor(protected price: Price, public sort: number) {
    super(sort)
  }

  render() {
    return `
      <div class="">
          <span class="w-auto block mr-3">
          <span class="block font-medium text-gray-900 whitespace-nowrap dark:text-white">${this.price.value}</span>
          </span>
          <span>
            <span class="block  bg-primary-100 text-slate-400 text-xs font-medium rounded dark:bg-primary-900 dark:text-primary-300">${this.price.value}</span>
            </span>  
      </div>
    `
  }
}
