export abstract class DomComponent {
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

  toggleClass(element: HTMLElement, selector: string, className: string) {
    const oldElement = document.querySelector(selector)
    if (oldElement) {
      oldElement.classList.remove(className)
    }
    if (element) {
      element.classList.add(className)
    }
  }
}
