import {Store} from '../store/moex';
import {DomComponent} from './DomComponent';
import {DomListener} from './DomListener';
import {Emitter} from './Emitter';

/**
 * Class representing components for @see App  */
export abstract class AppComponent extends DomListener implements IObjIndexable {
  /**
   * @this {AppComponent}
   * @param {DomComponent} $root - the root element of @see this
   * @param {DomOptions} options - emitter from @see App and state from index.ts
   */
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

  /**
   * execute all subscribed functions when some eventName happens throught @see Emitter
   * @param {string} eventName - some event (ex. "table:update")
   * @param {unknown[]} args - list of arguments */
  $emit(eventName: string, ...args: unknown[]): void {
    (this.emitter as Emitter).emit(eventName, ...args)
  }

  /**
   * add some function as subscriber of eventName in the @see Emitter and create unsub possibility
   * @param {string} eventName - some event (ex. "table:update")
   * @param {CallbackFunction} fn - callback function, what to do if @see $emit
   */
  $on(eventName: string, fn: CallbackFunction): void {
    const unsub = (this.emitter as Emitter).subscribe(eventName, fn)
    this.unsubs.push(unsub)
  }
  /**
   * we need to remove listeners if we destroy this component
   */
  destroy() {
    this.removeDOMListeners()
    this.unsubs.forEach((unsub: CallbackFunction) => unsub())
  }
}
