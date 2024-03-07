export abstract class DomComponent implements IObjIndexable {
  constructor(selector: string) {
    this.$root = document.querySelector(selector)
  }
  public $root: Element
  [index: string]: unknown

  $(selector: string) {
    const $el = document.querySelectorAll(selector)
    if ($el) {
      if ($el.length === 1) {
        return $el[0]
      } else {
        return $el
      }
    }
  }

  initListeners(eventType: string) {
    const clickElements = this.$root.querySelectorAll(`[data-${eventType}]`)
    clickElements.forEach(element => {
      const method: string = (element as HTMLElement).dataset[eventType]
      const fn = (this[method] as (ev: Event) => unknown).bind(this)
      this.on(element, eventType, fn)
    })
  }

  on(element: Element, eventType: string, callback: (ev: Event) => unknown) {
    element.addEventListener(eventType, callback)
  }

  toggleClass(element: Element, className: string) {
    if (element.classList.contains(className)) {
      element.classList.remove(className)
    } else {
      element.classList.add(className)
    }
  }

  toggleClassEl(element: HTMLElement, selector: string, className: string) {
    const oldElement = document.querySelector(selector)
    if (oldElement) {
      oldElement.classList.remove(className)
    }
    if (element) {
      element.classList.add(className)
    }
  }
}
