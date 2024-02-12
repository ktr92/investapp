export class Stock implements IObjIndexable {
  constructor(public ticker: string) {
    this.name = 'name'
    this.currentPrice = 10000
    this.dayChange = 500
    this.logo = 'https://storage.yandexcloud.net/snowball-data/asset-logos/SBER-MCX-RUB-custom.png'
  }
  public currentPrice: number
  [index: string]: unknown
}
