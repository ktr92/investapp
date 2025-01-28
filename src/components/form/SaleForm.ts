import {Store} from '../../store/moex'
import {initFormData, initSaleData} from '../../utils/getStockPrice'
import * as template from './form.tempalte'
import {Form} from './Form'

export class SaleForm extends Form {
  constructor(selector: string, public state: Store, public onSubmit?: (id: string, position: IPosition, isclone?: boolean, market?: string) => void, public modaldata?: IModalData) {
    super(selector, state, onSubmit, modaldata)
  }

  static async create(selector: string, state: Store, onSubmit?: (id: string, position: IPosition) => void, modaldata?: IModalData, ) {
    const instance = new SaleForm(selector, state, onSubmit, modaldata)
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

      result = initSaleData(
          this.category,
          formdata,
          this.state.moexSearch.moexSecurities,
          this.modaldata.ptf,
          this.modaldata.id)

      this.onSubmit(
          this.modaldata.ptf,
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
          + this.renderSalePrice(currentPosition.buyPrice)
          + this.renderSaleCount(currentPosition.count)
          + this.renderSaleNkd(currentPosition.nkd)
          + this.renderSaleCurrency(currentPosition.buyCurrency)

    form += template.renderSubmit()

    return form
  }
}
