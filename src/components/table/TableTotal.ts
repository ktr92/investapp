import {Totalprice} from '../position/Totalprice';
import {TableComponent} from './TableComponent';

export class TableTotal extends TableComponent {
  constructor(protected price: Totalprice, public sort: number) {
    super()
  }

  render() {
    return `
      <div class="">
          <span class="w-auto block mr-3">
          <span class="block font-medium text-gray-900 whitespace-nowrap dark:text-white">${this.price.value ? this.price.value + '₽' : ''}</span>          </span>
          <span>
            <span class="block  bg-primary-100 text-slate-400 text-xs font-medium rounded dark:bg-primary-900 dark:text-primary-300">${this.price.single} ₽</span>
            </span>  
      </div>
    `
  }
}
