import numberWithSpaces from '../../utils/formatNumber'
import {ViewComponent} from '../table/ViewComponent'

export class Count extends ViewComponent {
  constructor(public count: number = 1) {
    super()
  }

  render() {
    let value = ''
    if (this.count > 0 ) {
      value = `<div class="">
      <span class="w-auto block mr-3">
      <span class="block font-normal text-gray-900 whitespace-nowrap dark:text-white">${numberWithSpaces(this.count)} шт. </span>
      </span>
     
  </div>`
    }

    return value
  }
}
