import closeByClickOutside from '../../utils/clickOutside';
import changeClass from '../../utils/toggleClass';
import {DomComponent} from '../DomComponent';

interface IDropdownOptions {
  width?: string,
  placement?: string,
  delay?: number,
  ignoreClickOutsideClass?: boolean,
  position?: string
}
export default class Dropdown {
  constructor(public trigger: string, public target: string, public items: Array<IListItem>, public options: IDropdownOptions = {
    width: '300px',
    placement: 'bottom',
    delay: 200,
    ignoreClickOutsideClass: false,
    position: 'absolute'
  }) {
    this.$targetEl = document.querySelector(target)
    this.$triggerEl = document.querySelector(trigger)
    this.initDropdown()
  }
  private $targetEl: HTMLElement
  private $triggerEl: HTMLElement

  initDropdown() {
    this.$targetEl.classList.add(this.options.position)

    let listContent = ''
    this.items.forEach(item => {
      if (item.type === 'link') {
        listContent += `
        <li>
          <a href="${item.id}" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">${item.text}</a>
        </li>
      `
      } else {
        listContent += `
        <li>
          <span data-click="changeBroker" data-params="${item.id}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">${item.text}</span>
        </li>
      `
      }
    })

    this.$targetEl.innerHTML = `
      <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownButton">
        ${listContent}
      </ul>
    `

    this.$triggerEl.addEventListener('click', (e) => {
      changeClass(this.$triggerEl, 'active')
      changeClass(this.$targetEl, 'hidden')
    })

    closeByClickOutside(this.target, this.trigger)
  }
}
