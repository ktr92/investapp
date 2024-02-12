import {Change} from '../position/Change';
import {TableComponent} from './table/TableComponent';

export class TableChange extends TableComponent {
  constructor(protected change: Change, public sort: number = 99) {
    super(sort)
  }

  render() {
    return `
      <div class="">
          <span class="w-auto block mr-3">
          <span class="block font-medium text-gray-900 whitespace-nowrap dark:text-white">${this.change.currentValue}</span>
          </span>
          <span>
            <span class="block  bg-primary-100 text-slate-400 text-xs font-medium rounded dark:bg-primary-900 dark:text-primary-300">${((this.change.currentValue - this.change.startValue)/this.change.startValue * 100).toFixed(2)}%</span>
            </span>  
      </div>
    `
  }
}
