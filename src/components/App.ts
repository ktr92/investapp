import {AppComponent} from './AppComponent'
import {DomComponent} from './DomComponent'
import {Emitter} from './Emitter'

interface Constructor {
  new (...args: Array<unknown>): AppComponent,
  id?: string
}
type ExcelArray = Array<Constructor>
type InstancesArray = Array<AppComponent>

interface ExcelOptions {
  components: ExcelArray
}

export class App {
  public $el: DomComponent
  private components: ExcelArray
  private instances: InstancesArray
  public emitter: Emitter
  constructor(
    public selector: string,
    public options: ExcelOptions
  ) {
    this.$el = new DomComponent(selector)
    this.components = options.components || []
    this.emitter = new Emitter()
  }

  protected initApp() {
    const $root = document.createElement('div')

    const componentOptions = {
      emitter: this.emitter
    }

    this.instances = this.components.map(Component => {
      const $el = document.createElement('div')
      const component = new Component($el, componentOptions)
      $el.setAttribute('id', Component.id)
      $el.innerHTML = component.toHTML()
      $root.append($el)
      return component
    })

    return $root
  }

  public render() {
    this.$el.append(this.initApp())
    this.instances.forEach(component => component.init())
    console.log(this.instances)
  }
}
