 type CallbackFunction = (param?: unknown) => unknown

export class Emitter {
  listeners: IListener
  constructor() {
    this.listeners = {} as IListener
  }

  // component.emit('component:select', () => {})
  emit(eventName: string, ...args: unknown[]) {
    if (!Array.isArray(this.listeners[eventName])) {
      return false
    }
    this.listeners[eventName].forEach((listener: CallbackFunction) => {
      (listener as CallbackFunction)(...args)
    })

    return true
  }

  // component.subsribe('component:select', () => {})
  subscribe(eventName: string, fn: CallbackFunction) {
    this.listeners[eventName] = this.listeners[eventName] || []
    this.listeners[eventName].push(fn)

    return () => {
      this.listeners[eventName] = this.listeners[eventName].filter((item: CallbackFunction) => item != fn)
    }
  }
}

// const unsub = emitter.subscribe('event:event1', () => {console.log()});
// emit('event:event1', 55);
// unsub()
