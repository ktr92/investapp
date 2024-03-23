import {Store} from '../store';
import {DomComponent} from './DomComponent';
import {DomListener} from './DomListener';
import {Emitter} from './Emitter';

 interface DomOptions {
  name: string,
  listeners: Array<string>,
  emitter: Emitter,
  unsubs: Array<CallbackFunction>,
  state: Store
}

export abstract class AppComponent extends DomListener implements IObjIndexable {
  constructor($root: DomComponent, options: DomOptions) {
    super($root, options.listeners)
    this.emitter = options.emitter
    this.state = options.state
    this.unsubs = []
    this.prepare()
  }

  public unsubs: Array<CallbackFunction>
  static id: string
  [index: string]: unknown

  prepare(): void {
    return void 0
  }

  toHTML(): string {
    return ''
  }

  init() {
    this.initDOMListeners()
  }

  $emit(eventName: string, ...args: unknown[]) {
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
