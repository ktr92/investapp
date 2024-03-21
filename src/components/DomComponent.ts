export class DomComponent implements IObjIndexable {
  constructor(selector: string) {
    this.$root = document.querySelector(selector)
  }
  public $root: HTMLElement | Element
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

  append(node: DomComponent | Element) {
    if (node instanceof DomComponent) {
      node = node.$root
    }
    this.$root.append(node)
    return this
  }

  initListeners(eventType: string) {
    const clickElements = this.$root.querySelectorAll(`[data-${eventType}]`)
    console.log(clickElements)
    clickElements.forEach(element => {
      const method: string = (element as HTMLElement).dataset[eventType]
      const fn = (this[method] as (ev: Event) => unknown).bind(this)

      this.onEvent(element, eventType, fn)
    })
  }

  onEvent(element: Element, eventType: string, callback: (ev: Event, params?: unknown) => unknown) {
    element.addEventListener(eventType, callback)
  }

  offEvent(eventType: string, callback: (ev: Event, params?: unknown) => unknown) {
    this.$root.removeEventListener(eventType, callback)
  }

  on(eventType: string, callback: (ev: Event, params?: unknown) => unknown) {
    this.$root.addEventListener(eventType, callback)
  }

  off(eventType: string, callback: (ev: Event, params?: unknown) => unknown) {
    this.$root.removeEventListener(eventType, callback)
  }

  content(value: string) {
    this.$root.innerHTML = value
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
