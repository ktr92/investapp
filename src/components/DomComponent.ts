export abstract class DomComponent {
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
