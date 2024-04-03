import {AppComponent} from './AppComponent'
import {DomComponent} from './DomComponent'
import {Emitter} from './Emitter'
interface IState {
  moex: IMarketsApi
}
interface Constructor {
  new (...args: Array<unknown>): AppComponent,
  id?: string
}
type AppArray = Array<Constructor>
type InstancesArray = Array<AppComponent>

interface AppOptions {
  components: AppArray,
  state: IState
}

export class App {
  public $el: DomComponent
  private components: AppArray
  private instances: InstancesArray
  public emitter: Emitter
  public state: IState
  constructor(
    public selector: string,
    public options: AppOptions
  ) {
    this.state = options.state,
    this.$el = new DomComponent(selector)
    this.components = options.components || []
    this.emitter = new Emitter()
  }

  protected initApp() {
    const $root = document.createElement('div')

    const componentOptions = {
      emitter: this.emitter,
      state: this.state
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
  }
}
