import {DomComponent} from './DomComponent';

export abstract class DomListener {
  constructor(public $root: DomComponent, public listeners: Array<string>) {
    if (!$root) {
      throw new Error('No $root provided for DomListenter');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [index: string]: any

  initListeners(eventType: string) {
    const clickElements = this.$root.querySelectorAll(`[data-${eventType}]`)
    clickElements.forEach(element => {
      const method: string = (element as HTMLElement).dataset[eventType]
      if (this[method]) {
        const fn = (this[method] as (ev: Event) => unknown).bind(this)
        this.on(element, eventType, fn)
      }
    })
  }

  initDOMListeners(): void {
    this.listeners.forEach(listener => {
      const method: string = listener
      if (!this[method]) {
        const name = this.name || ''
        throw new Error(
            `Method ${method} is not implemented in ${name} Component`
        )
      }
      this[method] = this[method].bind(this)
      this.$root.on(listener, this[method])
    })
  }

  removeDOMListeners(): void {
    this.listeners.forEach(listener => {
      const method: string = listener
      /*  this.$root.off(listener, this[method]) */
    })
  }
}
