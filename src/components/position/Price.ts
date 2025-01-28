import {Store} from '../../store/moex';
import numberWithSpaces from '../../utils/formatNumber';
import {ViewComponent} from '../table/ViewComponent';

export class Price extends ViewComponent {
  constructor(public value: number = null, options: Store) {
    super(options)
  }

  render() {
    let result = null
    if (this.value) {
      result = numberWithSpaces(this.value.toFixed(2)) + ' ₽'
    } else {
      result = '-'
    }
    return `
      <div class="">
          <span class="w-auto block mr-3">
          <span class="block font-normal text-gray-900 whitespace-nowrap dark:text-white">${result}</span>
          </span>
        
      </div>
    `
  }
}
