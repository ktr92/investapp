import {DomComponent} from '../DomComponent'

export class Modal extends DomComponent {
  constructor(selector: string, public options: unknown) {
    super(selector)
    const modal = this.initModal()
    document.querySelector('body').insertAdjacentHTML('beforeend', modal)
    document.querySelectorAll('[data-modal-toggle]').forEach((item) => {
      item.addEventListener('click', () => {
        this.closeModal()
      })
    })
  }

  closeModal() {
    document.querySelector(`#modal`).classList.add('hidden')
  }

  initModal() {
    return `
        <div id="modal" tabindex="-1" aria-hidden="true" class="flex bg-[rgba(0,0,0,0.55)] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 m-auto z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
        <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
            <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                <!-- Modal header -->
                <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                        Update Product
                    </h3>
                    <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="updateProductModal">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
              <div id="modalContent"></div>
          </div>
        </div>
    </div>
    `
  }
}