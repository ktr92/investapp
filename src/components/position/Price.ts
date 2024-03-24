import {Store} from '../../store';
import numberWithSpaces from '../../utils/formatNumber';
import {ViewComponent} from '../table/ViewComponent';

export class Price extends ViewComponent {
  constructor(public value: number = null, options: Store) {
    super(options)
  }

  render() {
    return `
      <div class="">
          <span class="w-auto block mr-3">
          <span class="block font-normal text-gray-900 whitespace-nowrap dark:text-white">${numberWithSpaces(this.value)} ₽</span>
          </span>
        
      </div>
    `
  }
}
