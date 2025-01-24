import {AppComponent} from './AppComponent'
import {DomComponent} from './DomComponent'
import {Emitter} from './Emitter'

/** this is needed as the state of the App from the index.ts */
interface IState {
  moex: IMarketsApi
}
/** this is needed as the list of components from the index.ts */
type AppArray = Array<Constructor>

/** this is needed to save instances components inside the App */
type InstancesArray = Array<AppComponent>

/** this is needed to initialize instances of the components   */
interface Constructor {
  new (...args: Array<unknown>): AppComponent
  id?: string
}

/** this is needed as the App params from index.ts */
interface AppOptions {
  components: AppArray
  state: IState
}

/** Class representing the main app instance. */
export class App {
  /**
   * the root element of the App
   */
  public $el: DomComponent
  /**
   * The list of components constructors to initilize inside the App
   */
  private components: AppArray
  /**
   * Initialized instances of the @see components
   */
  private instances: InstancesArray
  /**
   * The only Emitter that is used in the App @see Emitter
   */
  public emitter: Emitter

  /**
   * The store instance from index.ts
   */
  public state: IState

  /**
   * Creating an App: initiaziling @see Emitter and the root element @see DomComponent
   * @constructor
   * @this {App}
   * @param {string} selector - the element to attach the app
   * @param {AppOptions} options - the list of components @see components and the main storage @see state that make up the app
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
   * initializing @see components as @see instances
   * @return {HTMLDivElement} to append inside the @see $el
   * instances are saved in the App
   */
  protected initApp(): HTMLDivElement {
    const $root = document.createElement('div')

    const componentOptions = {
      emitter: this.emitter,
      state: this.state,
    }
    /** every instance includes @see emitter and @see state */
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

  /** append the App to html element @see $el to make possible to initilize Event Listeners for every instance with {@link AppComponent.init} */
  public render() {
    this.$el.append(this.initApp())
    this.instances.forEach((component) => component.init())
  }
}
