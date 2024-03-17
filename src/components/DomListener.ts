import {DomComponent} from './DomComponent';

type CallbackFunction = (param?: unknown) => unknown

export abstract class DomListener {
  constructor(public $root: DomComponent, public listeners: Array<string>) {
    if (!$root) {
      throw new Error('No $root provided for DomListenter');
    }
  }

  [index: string]: unknown

  initDOMListeners(): void {
    this.listeners.forEach(listener => {
      const method: string = listener
      if (!this[method]) {
        const name = this.name || ''
        throw new Error(
            `Method ${method} is not implemented in ${name} Component`
        )
      }
      this[method] = (this[method] as (ev: Event) => unknown).bind(this)
      this.$root.on(listener, (this[method] as (ev: Event) => unknown))
    })
  }

  removeDOMListeners(): void {
    this.listeners.forEach(listener => {
      const method: string = listener
      this.$root.off(listener, (this[method] as (ev: Event) => unknown))
    })
  }
}
