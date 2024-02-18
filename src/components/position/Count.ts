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
      <span class="block font-medium text-gray-900 whitespace-nowrap dark:text-white">${this.count} шт. </span>
      </span>
     
  </div>`
    }

    return value
  }
}
