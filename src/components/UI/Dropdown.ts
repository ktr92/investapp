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
  constructor(public trigger: string, public triggerText: string, public target: string, public items: Array<IListItem>, callback?: CallbackFunction, public options: IDropdownOptions = {
    width: '300px',
    placement: 'bottom',
    delay: 200,
    ignoreClickOutsideClass: false,
    position: 'absolute'
  }) {
    this.$targetEl = document.querySelector(target)
    this.$triggerEl = document.querySelector(trigger)
    this.triggerText = triggerText
    this.callback = callback
    this.initDropdown()
  }
  private $targetEl: HTMLElement
  private $triggerEl: HTMLElement
  public callback: CallableFunction

  initDropdown() {
    this.$targetEl.classList.add(this.options.position)

    this.$triggerEl.firstChild.textContent = this.triggerText

    let listContent = ''
    this.items.forEach(item => {
      if (item.type === 'link') {
        listContent += `
        <li>
          <a href="${item.id}" data-value="${item.text}" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">${item.text}</a>
        </li>
      `
      } else {
        listContent += `
        <li>
          <span  data-params="${item.id}" data-value="${item.text}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">${item.text}</span>
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

    this.changeText()

    closeByClickOutside(this.target, this.trigger)
  }

  changeText() {
    this.$targetEl.addEventListener('click', (e) => {
      if (e.target instanceof HTMLElement) {
        if (e.target.dataset.value) {
          this.$triggerEl.firstChild.textContent = e.target.dataset.value
          if (this.callback) {
            this.callback(e)
          }
        }
      }
    })
  }

  reset() {
    this.$triggerEl.firstChild.textContent = this.triggerText
  }
}
