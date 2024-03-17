import {DomComponent} from './DomComponent'
import {Emitter} from './Emitter'

interface Constructor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any): DomComponent,
}
type ExcelArray = Array<Constructor>
type InstancesArray = Array<DomComponent>

interface ExcelOptions {
  components: ExcelArray
}

export class App {
  private $el: string
  private components: ExcelArray
  private instances: InstancesArray
  public emitter: Emitter
  constructor(
    private selector: string,
    private options: ExcelOptions
  ) {
    this.$el = selector
    this.components = options.components || []
    this.emitter = new Emitter()
  }

  private initApp() {
    const $root = document.createElement('div')

    const componentOptions = {
      emitter: this.emitter
    }

    this.instances = this.components.map(Component => {
      const $el = document.createElement('div')
      const component = new Component($el, componentOptions)
      $root.append($el)
      return component
    })
  }
}
