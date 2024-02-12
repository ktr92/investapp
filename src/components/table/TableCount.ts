import {Count} from '../position/Count';
import {TableComponent} from './TableComponent';

export class TableCount extends TableComponent {
  constructor(protected count: Count, public sort: number) {
    super(sort)
  }

  render() {
    let value = ''
    if (this.count.count > 0 ) {
      value = `<div class="">
      <span class="w-auto block mr-3">
      <span class="block font-medium text-gray-900 whitespace-nowrap dark:text-white">${this.count.count} шт. </span>
      </span>
     
  </div>`
    }

    return value
  }
}
