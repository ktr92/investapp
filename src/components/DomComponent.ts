/** Class for DOM-elements to make a simplified interface for operating with the DOM-tree */
export class DomComponent implements IObjIndexable {
  /**
   * @param {string} selector - the root element's selector
   * @this {DomComponent}
   */
  constructor(selector: string) {
    this.$root = document.querySelector(selector)
  }
  public $root: HTMLElement | Element
  [index: string]: unknown

  /**
   * @param {string} selector - selector to find element
   * @return {NodeListOf<Element> | Element} - selected element if there is the only one on the page or a list of elements
   */
  $(selector: string): NodeListOf<Element> | Element {
    const $el = document.querySelectorAll(selector)
    if ($el) {
      if ($el.length === 1) {
        return $el[0]
      } else {
        return $el
      }
    }
  }

  /**
   * @param {DomComponent | Element} node - the element to append
   * @return {DomComponent} - the root element {@link $root} wuth appended {@link node}
   */
  append(node: DomComponent | Element): DomComponent {
    if (node instanceof DomComponent) {
      node = node.$root
    }
    this.$root.append(node)
    return this
  }

  initListeners(eventType: string): void {
    const clickElements = this.$root.querySelectorAll(`[data-${eventType}]`)
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
