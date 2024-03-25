import closeByClickOutside from '../../utils/clickOutside'
import {Store} from '../../store'
import {AppComponent} from '../AppComponent'
import {DomComponent} from '../DomComponent'
import {Emitter} from '../Emitter'

interface DomOptions {
  name: string,
  listeners: Array<string>,
  emitter: Emitter,
  unsubs: Array<CallbackFunction>,
  state: Store
}
interface IModal {
  content: string,
  title: string
}

export class Modal extends AppComponent {
  constructor(selector: DomComponent, options: DomOptions) {
    super(selector, {
      listeners: [],
      ...options
    })
    this.emitter = options.emitter
    this.state = options.state
    this.unsubs = []
  }

  public state: Store
  public el: DomComponent
  static id = 'modal'

  init(): void {
    document.querySelectorAll('[data-modal-toggle]').forEach((item) => {
      item.addEventListener('click', () => {
        this.closeModal()
      })
    })

    this.$on('modal:renderModal', (content: IModal) => {
      document.querySelector('#modalWrapper').classList.remove('hidden')
      document.querySelector('#modalContent').innerHTML = content.content
      document.querySelector('#modalTitle').innerHTML = content.title
    })

    closeByClickOutside('#modalBlock', '[data-modal]', () => {
      document.querySelector(`#modalBlock`).classList.remove('hidden')
      document.querySelector(`#modalWrapper`).classList.add('hidden')
    })
  }

  toHTML(): string {
    return `
      <div id="modalWrapper" tabindex="-1" aria-hidden="true" class="flex bg-[rgba(0,0,0,0.55)] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 m-auto z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full hidden">
      <div id="modalBlock" class="relative p-4 w-full max-w-2xl h-full md:h-auto">
          <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
              <!-- Modal header -->
              <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  <div id="modalTitle"></div>
                  </h3>
                  <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="updateProductModal">
                      <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                      <span class="sr-only">Close modal</span>
                  </button>
              </div>
            <div id="modalContent" class="text-gray-900 dark:text-white"></div>
        </div>
      </div>
  </div>
  `
  }

  closeModal() {
    document.querySelector(`#modalWrapper`).classList.add('hidden')
    document.querySelector('#modalContent').innerHTML = ''
    document.querySelector('#modalTitle').innerHTML = ''
  }
}
