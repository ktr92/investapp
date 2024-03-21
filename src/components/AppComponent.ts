/* eslint-disable @typescript-eslint/no-explicit-any */
import {DomComponent} from './DomComponent';
import {DomListener} from './DomListener';
import {Emitter} from './Emitter';

declare interface DomOptions {
  name: string,
  listeners: Array<string>,
  emitter: Emitter,
  unsubs: Array<CallbackFunction>
}

export abstract class AppComponent extends DomListener {
  constructor($root: DomComponent, options: DomOptions) {
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
    (this.emitter as Emitter).emit(eventName, ...args)
  }

  $on(eventName: string, fn: CallbackFunction) {
    const unsub = (this.emitter as Emitter).subscribe(eventName, fn)
    this.unsubs.push(unsub)
  }

  destroy() {
    this.removeDOMListeners()
    this.unsubs.forEach((unsub: CallbackFunction) => unsub())
  }
}
