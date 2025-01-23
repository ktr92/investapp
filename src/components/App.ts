import {AppComponent} from './AppComponent'
import {DomComponent} from './DomComponent'
import {Emitter} from './Emitter'
interface IState {
  moex: IMarketsApi
}
interface Constructor {
  new (...args: Array<unknown>): AppComponent
  id?: string
}
type AppArray = Array<Constructor>
type InstancesArray = Array<AppComponent>

interface AppOptions {
  components: AppArray
  state: IState
}

/** Class representing the main app instance. */
export class App {
  /**
   * the root element of the @see App
   */
  public $el: DomComponent
  /**
   * The list of components constructors to initilize inside the @see App
   */
  private components: AppArray
  /**
   * Initialized instances of the @see components
   */
  private instances: InstancesArray
  /**
   * The only Emitter using throught the App @see Emitter
   */
  public emitter: Emitter

  /**
   * the Store @see {Store}
   */
  public state: IState

  /**
   * Creating an @see App : initiaziling @see Emitter and the root element @see DomComponent
   * @constructor
   * @this {App}
   * @param {string} selector - the element to attach the app
   * @param {AppOptions} options - the list of components and the main storage that make up the app
   */
  constructor(
    public selector: string,
    public options: AppOptions
  ) {
    (this.state = options.state), (this.$el = new DomComponent(selector))
    this.components = options.components || []
    this.emitter = new Emitter()
  }

  /**
   * initializing components
   * @return {HTMLDivElement} The x value.
   */
  protected initApp(): HTMLDivElement {
    const $root = document.createElement('div')

    const componentOptions = {
      emitter: this.emitter,
      state: this.state,
    }

    this.instances = this.components.map((Component) => {
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
    this.instances.forEach((component) => component.init())
  }
}
