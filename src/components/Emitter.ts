type CallbackFunction = (param?: unknown) => unknown

/**
 * class is Event Listener for custom events throught the App (ex. 'table:update')
 */
export class Emitter {
  listeners: IListener

  /**
   * create an empty initial listeners object
   * @this {Emitter}
   */
  constructor() {
    this.listeners = {} as IListener
  }

  // component.emit('component:select', () => {})

  /**
   * this function execute all listeners when some eventName happens
   * @param {string} eventName - some event (ex. table:update)
   * @param {unknown[]} args - params of the listener callback
   * @return {boolean} - false if there is no one listener for some event, otherwise execute function and return true
   */
  emit(eventName: string, ...args: unknown[]): boolean {
    if (!Array.isArray(this.listeners[eventName])) {
      return false
    }
    this.listeners[eventName].forEach((listener: CallbackFunction) => {
      (listener as CallbackFunction)(...args)
    })

    return true
  }

  // component.subsribe('component:select', () => {})

  /**
   * add some fn to eventName: listeners[]
   * @param {string} eventName - key of the @see listeners object
   * @param {CallbackFunction} fn - function to add in listeners of eventName
   * @return {IListener} - we return a function which removes @see fn from the list of subscribers on eventName. This makes possible to unsub from the @see AppComponent calling this return value
   */
  subscribe(eventName: string, fn: CallbackFunction): CallbackFunction {
    this.listeners[eventName] = this.listeners[eventName] || []
    this.listeners[eventName].push(fn)

    return () => {
      this.listeners[eventName] = this.listeners[eventName].filter((item: CallbackFunction) => item != fn)
    }
  }
}

// emit('event:event1', 55);
// unsub()
