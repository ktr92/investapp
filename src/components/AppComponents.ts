/* eslint-disable @typescript-eslint/no-explicit-any */
import {DomListener} from './DomListener';
import {CallbackFunction, Emitter} from './Emitter';

interface DomOptions {
  name: string,
  listeners: Array<string>,
  emitter: Emitter,
  unsubs: Array<CallbackFunction>
}

export abstract class ExcelComponent extends DomListener {
  constructor($root: HTMLElement, options: DomOptions) {
    super($root, options.listeners)
    this.emitter = options.emitter
    this.unsubs = []
    this.prepare()
  }

  prepare(): void {
    return void 0
  }

  static className: string
  toHTML(): string {
    return ''
  }

  init() {
    this.initDOMListeners()
  }

  $emit(eventName: string, ...args: any[]) {
    this.emitter.emit(eventName, ...args)
  }

  $on(eventName: string, fn: CallbackFunction) {
    const unsub = this.emitter.subscribe(eventName, fn)
    this.unsubs.push(unsub)
  }

  destroy() {
    this.removeDOMListeners()
    this.unsubs.forEach((unsub: CallbackFunction) => unsub())
  }
}
