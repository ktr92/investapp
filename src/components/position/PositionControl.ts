import closeByClickOutside from '../../utils/clickOutside';
import {Store} from '../../store';
import {ViewComponent} from '../table/ViewComponent';
import {CreateForm} from '../form/CreateForm';
import {Emitter} from '../Emitter';
import {BuyForm} from '../form/BuyForm';
import {EditForm} from '../form/EditForm';
import {DeleteForm} from '../form/DeleteForm';
import {SaleForm} from '../form/SaleForm';

export class PositionControl extends ViewComponent {
  constructor(public itemInfo: IItemInfo, options: Store) {
    super(options)
  }

  public emitter: Emitter

  initListeners(emitter: Emitter) {
    this.emitter = emitter
    const modaldata = {
      id: this.itemInfo.positionId,
      ptf: this.itemInfo.portfolioId,
      market: this.itemInfo.marketId
    }
    const $button =document.querySelector(`#button_position${this.itemInfo.positionId}`)
    const $menu = document.querySelector(`#menu_position${this.itemInfo.positionId}`)
    $button.addEventListener('click', (e) => {
      $menu.classList.remove('hidden')
    })

    document.querySelector(`[data-buypos="${this.itemInfo.positionId}"]`).addEventListener('click', async (e) => {
      const create = await BuyForm.create('#modalContent', this.options, this.onBuy.bind(this), modaldata)
      emitter.emit('modal:renderModal', {
        title: 'Buy position',
        content: create.$el.innerHTML
      })

      await create.initForm()
      $menu.classList.add('hidden')
    })

    document.querySelector(`[data-editpos="${this.itemInfo.positionId}"]`).addEventListener('click', async (e) => {
      const create = await EditForm.create('#modalContent', this.options, this.onEdit.bind(this), modaldata)

      emitter.emit('modal:renderModal', {
        title: 'Edit position',
        content: create.$el.innerHTML
      })

      await create.initForm()
      $menu.classList.add('hidden')
    })
    document.querySelector(`[data-deletepos="${this.itemInfo.positionId}"]`).addEventListener('click', async (e) => {
      const create = await DeleteForm.create('#modalContent', this.options, this.onDelete.bind(this), modaldata)
      emitter.emit('modal:renderModal', {
        title: 'Delete position',
        content: create.$el.innerHTML
      })

      await create.initForm()
      $menu.classList.add('hidden')
    })
    document.querySelector(`[data-salepos="${this.itemInfo.positionId}"]`).addEventListener('click', async (e) => {
      const create = await SaleForm.create('#modalContent', this.options, this.onSale.bind(this), modaldata)
      emitter.emit('modal:renderModal', {
        title: 'Sale position',
        content: create.$el.innerHTML
      })

      await create.initForm()
      $menu.classList.add('hidden')
    })

    closeByClickOutside(`#menu_position${this.itemInfo.positionId}`, `#button_position${this.itemInfo.positionId}`)
  }

  onBuy(brokerId: string, position: IPosition, isclone: boolean, market: string) {
    this.options.actions.addPosition(brokerId, position, isclone, market)
    this.emitter.emit('header:moexUpdate', this.itemInfo.portfolioId)
    this.emitter.emit('modal:closeModal')
  }
  onEdit(id: string, position: IPosition) {
    this.options.actions.editPosition(this.itemInfo.portfolioId, position)
    this.emitter.emit('header:moexUpdate', this.itemInfo.portfolioId)
    this.emitter.emit('modal:closeModal')
  }
  onDelete(id: string, position: IPosition) {
    this.options.actions.deletePosition(this.itemInfo.portfolioId, position)
    this.emitter.emit('header:moexUpdate', this.itemInfo.portfolioId)
    this.emitter.emit('modal:closeModal')
  }
  onSale(id: string, position: IPosition) {
    this.options.actions.salePosition(this.itemInfo.portfolioId, position)
    this.emitter.emit('header:moexUpdate', this.itemInfo.portfolioId)
    this.emitter.emit('modal:closeModal')
  }

  render() {
    return `
      <div class="flex relative">
        <button id="button_position${this.itemInfo.positionId}" data-dropdown-toggle="dropdown" class="text-white bg-slate-500 hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-1 py-2.5 text-center inline-flex items-center dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800 w-10 justify-center" type="button"> 
          <svg class="w-2.5 h-2.5 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
          </svg>
      </button>
      
      <div id="menu_position${this.itemInfo.positionId}" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute top-full right-0">
        <div class='class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"' data-buypos="${this.itemInfo.positionId}" >Купить</div>
        <div class='class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"' data-salepos="${this.itemInfo.positionId}">Продать</div>
        <div class='class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"' data-editpos="${this.itemInfo.positionId}">Изменить</div>
        <div class='class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"' data-deletepos="${this.itemInfo.positionId}">Удалить</div>
      </div>
    </div>
    `
  }
}
