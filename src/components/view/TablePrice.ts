import {Price} from '../position/Price';
import {TableComponent} from './table/TableComponent';

export class TablePrice extends TableComponent {
  constructor(protected price: Price, public sort: number = 99) {
    super(sort)
  }

  render() {
    return `
      <div class="">
          <span class="w-auto block mr-3">
          <span class="block font-medium text-gray-900 whitespace-nowrap dark:text-white">${this.price.value ? this.price.value + '₽' : ''} </span>
          </span>
         
      </div>
    `
  }
}
