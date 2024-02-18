import {ViewComponent} from '../table/ViewComponent';

export class Price extends ViewComponent {
  constructor(public value: number = null) {
    super()
  }

  render() {
    return `
      <div class="">
          <span class="w-auto block mr-3">
          <span class="block font-normal text-gray-900 whitespace-nowrap dark:text-white">${this.value} ₽</span>
          </span>
        
      </div>
    `
  }
}
