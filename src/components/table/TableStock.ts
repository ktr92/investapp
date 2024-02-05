import {Stock} from '../Stock';
import {TableComponent} from './TableComponent';

export class TableStock extends TableComponent {
  constructor(public title: string, protected stock: Stock) {
    super(title)
  }
  render() {
    return `
      <div class="">
        <a href="#" target="_blank" class="flex items-center">
          <span class="w-auto h-8 mr-3">
            <img src=${this.stock.image}>
          </span>
          <span>
            <span class="font-medium text-gray-900 whitespace-nowrap dark:text-white">${this.stock.name}</span>
            <span class="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">${this.stock.ticker}</span>
            </span>  
        </a>
      </div>
    `
  }
}
