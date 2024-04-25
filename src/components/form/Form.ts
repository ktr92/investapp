import {mapMarket} from '../../utils/maps'
import {Store} from '../../store'
import numberWithSpaces from '../../utils/formatNumber'

import * as template from './form.tempalte'

interface IModalData {
  id: string,
  ptf: string,
  market: string
}

export abstract class Form {
  constructor(selector: string, public state: Store, public onSubmit?: (id: string, position: IPosition, isclone?: boolean, market?: string) => void, public modaldata?: IModalData) {
    this.$el = document.querySelector(selector)
    this.isvalid = false
    this.category = this.state.getters.getCategory(this.state.defaultPortfolio)
  }
  public $el: HTMLElement
  public foundList: Array<Array<string>>
  public isvalid: boolean
  public currentTicker: string
  public category: string
  public mDataList: IMarketsList
  public isLoading: boolean
  public currentItem: IItem
  public currentPortfolio: string

  async initMarketData() {
    await this.state.actions.initSearch(this.category)
  }

  postInit(): void {
    return void 0
  }

  async initForm() {
    const $form = document.createElement('form')
    $form.setAttribute('id', 'createForm')
    this.$el.insertAdjacentElement('beforeend', $form)
    const formContent = await this.renderMode()
    $form.insertAdjacentHTML('afterbegin', template.initTemplate(formContent))
    this.postInit()
    this.changeFields()
    this.initFormSubmit()
  }

  changeForm(loading: boolean) {
    const $loader = document.querySelector('.loader')
    if (loading) {
      $loader.classList.remove('hidden')
    } else {
      $loader.classList.add('hidden')
    }
  }

  addVisible(selector: string) {
    const $el = document.querySelector(selector)
    if ($el) {
      $el.classList.remove('hidden')
    }
  }
  removeVisible(selector: string) {
    const $el = document.querySelector(selector)
    if ($el) {
      $el.classList.add('hidden')
    }
  }

  changeFields() {
    if (mapMarket()[this.category].type === 'bonds') {
      this.removeVisible('[data-input="stopValue"]')
      this.addVisible('[data-input="nkd"]')
      this.addVisible('[data-input="stopValue"]')
    } else {
      this.addVisible('[data-input="stopValue"]')
      this.removeVisible('[data-input="nkd"]')
      this.removeVisible('[data-input="stopValue"]')
    }
    /*     $ticker.focus() */
  }

  calcCurrency() {
    const $currency: HTMLElement = document.querySelector('[data-input="currencyValue"]')
    const $currencyInput: HTMLInputElement = $currency.querySelector('input')

    const isCurrency = this.currentItem.currency
    if (isCurrency && isCurrency !== 'SUR') {
      $currency.classList.remove('hidden')
      $currencyInput.value = String(this.state.getters.getCurrency(isCurrency))
    } else {
      $currency.classList.add('hidden')
      $currencyInput.value = '1'
    }
  }

  calc(ticker: string, isload: boolean) {
    let stop = 0;
    let count = 0
    let price = 0;
    const $price = document.querySelector('input[name="price"]') as HTMLInputElement
    const $stop = document.querySelector('input[name="stop"]') as HTMLInputElement
    const $count = document.querySelector('input[name="count"]') as HTMLInputElement
    const $result = document.querySelector('[data-result="total"]') as HTMLDivElement
    const $nkd = document.querySelector('input[name="nkd"]') as HTMLInputElement
    const broker = (document.querySelector('#portfolio') as HTMLSelectElement).value
    this.currentPortfolio = broker

    if (ticker === '') {
      $price.value = ''
      $stop.value = ''
      $count.value = ''
      $result.textContent = '0'

      return
    }

    if (isload) {
      const nominal = this.currentItem.nominal
      const currency = this.state.getters.getCurrency(this.currentItem.currency)

      const textprice = this.currentItem.price * Number(currency) * (nominal > 1 ? (Number(nominal) / 100) : 1)

      stop = Number(this.currentItem.price) * 0.98;
      count = Math.round(this.state.getters.getPortfolioSumm(broker)/Number(textprice))
      $result.textContent = numberWithSpaces(String((textprice * count).toFixed(2)));
    } else {
      price = Number($price.value)
      stop = Number($stop.value)
      count = Number($count.value)
    }

    $price.value = String(this.currentItem.price);
    $count.value = String(count);
    $stop.value = String(stop.toFixed(2));
    $nkd.value = String(this.currentItem.nkd);
  }

  initFormListeners() {
    this.$el.querySelectorAll('input[data-calc="totalprice"]').forEach(item => {
      item.addEventListener('input', (e) => {
        if (this.currentTicker) {
          this.calc(this.currentTicker, false)
        }
      })
    })
    this.$el.querySelector('[name="category"]').addEventListener('change', async (e) => {
      this.category = (e.target as HTMLSelectElement).value
      this.changeForm(true)
      await this.initMarketData()
      this.changeFields()
      this.changeForm(false)
    })
  }

  initFormSubmit(): void {
    return void 0
  }

  async renderMode() {
    return ''
  }

  renderName(value?: string) {
    return template.renderInput('name', 'text', 'Наименование', value || '', '', 'readonly', 'Наименование')
  }
  renderPrice(value?: string | number) {
    return template.renderInput('price', 'number', 'Цена покупки', value || '0', '', 'data-calc="totalprice"', 'Цена')
  }

  renderNkd(value?: string | number) {
    return template.renderInput('nkd', 'number', 'НКД', value || '0', 'data-input="nkd"', 'data-calc="totalprice"', 'НКД', '', 'hidden')
  }
  renderCount(value?: string | number) {
    return template.renderInput('count', 'number', 'Количество', value || '1', 'data-input="count"', 'data-calc="totalprice"', 'Количество')
  }
  renderStop(value?: string | number) {
    return template.renderInput('stop', 'number', 'Стоп-лосс', value || '0', 'data-input="stopValue"', 'data-calc=""', 'Стоп-лосс')
  }
  renderCurrency(value?: string | number) {
    return template.renderInput('currencyValue', 'number', 'Валюта в момент сделки', value || '1', 'data-input="currencyValue"', 'data-calc="totalprice"', 'Курс валюты', '', 'hidden')
  }

  renderDescription(value?: string) {
    return template.renderTextarea('description', 'Комментарии', '4', 'Примечание', value || '')
  }
  renderSalePrice(value?: string | number) {
    return template.renderInput('salePrice', 'number', 'Цена продажи', value || '0', '', 'data-calc="totalprice"', 'Цена')
  }
  renderSaleNkd(value?: string | number) {
    return template.renderInput('saleNkd', 'number', 'НКД', value || '0', 'data-input="nkd"', 'data-calc="totalprice"', 'НКД', '', 'hidden')
  }
  renderSaleCount(value?: string | number) {
    return template.renderInput('saleCount', 'number', 'Количество', value || '1', 'data-input="count"', 'data-calc="totalprice"', 'Количество')
  }
  renderSaleCurrency(value?: string | number) {
    return template.renderInput('saleCurrency', 'number', 'Валюта в момент сделки', value || '1', 'data-input="currencyValue"', 'data-calc="totalprice"', 'Курс валюты', '', 'hidden')
  }
}
