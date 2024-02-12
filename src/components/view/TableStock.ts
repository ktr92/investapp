import {Stock} from '../position/Stock';
import {TableComponent} from './table/TableComponent';

export class TableStock extends TableComponent {
  constructor(protected stock: Stock, public sort: number) {
    super(sort)
  }

  render() {
    return `
      <div class="">
        <a href="#" target="_blank" class="flex items-center">
          <span class="w-auto h-8 mr-3">
            <img src=${this.stock.logo} width="40" height="40">
          </span>
          <span>
            <span class="block font-medium text-gray-900 whitespace-nowrap dark:text-white">${this.stock.name}</span>
            <span class="block  bg-primary-100 text-slate-400 text-xs font-medium rounded dark:bg-primary-900 dark:text-primary-300">${this.stock.ticker}</span>
            </span>  
        </a>
      </div>
    `
  }
}
