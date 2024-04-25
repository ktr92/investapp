import {Store} from '../../store'
import {initFormData} from '../../utils/getStockPrice'
import * as template from './form.tempalte'
import {Form} from './Form'

interface IModalData {
  id: string,
  ptf: string,
  market: string
}

export class BuyForm extends Form {
  constructor(selector: string, public state: Store, public onSubmit?: (id: string, position: IPosition, isclone?: boolean, market?: string) => void, public modaldata?: IModalData) {
    super(selector, state, onSubmit, modaldata)
  }

  static async create(selector: string, state: Store, onSubmit?: (id: string, position: IPosition, isclone?: boolean,) => void, modaldata?: IModalData, ) {
    const instance = new BuyForm(selector, state, onSubmit, modaldata)
    await instance.initMarketData()
    return instance
  }

  async initMarketData() {
    await this.state.actions.initSearch(this.category)
  }

  postInit(): void {
    return void 0
  }

  initFormSubmit() {
    this.$el.querySelector('form').addEventListener('submit', async (e) => {
      e.preventDefault()
      const formdata = new FormData(this.$el.querySelector('form'))

      let result = null

      result = initFormData(
          this.category,
          formdata,
          this.state.moexSearch.moexSecurities,
            this.currentPortfolio ? this.currentPortfolio : this.modaldata.ptf,
            this.modaldata ? this.modaldata.id : null)

      this.onSubmit(
          this.currentPortfolio ? this.currentPortfolio : this.modaldata.ptf,
          result,
          Boolean(formdata.get('isclone')),
          this.category
      )
    });
  }

  async renderMode() {
    let form = ''
    let currentPosition: IPosition = null
    if (this.modaldata) {
      currentPosition= this.state.getters.getPositionById(this.modaldata.id)
      this.category = this.modaldata.market ? this.modaldata.market: this.category
      await this.initMarketData()
    }

    form +=
          this.renderName(currentPosition.ticker)
          + template.renderClone()
          + this.renderPrice(currentPosition.buyPrice)
          + this.renderCount(currentPosition.count)
          + this.renderNkd(currentPosition.nkd)
          + this.renderCurrency(currentPosition.buyCurrency)
          + this.renderStop(currentPosition.myStop)

    form += template.renderSubmit()

    return form
  }
}
