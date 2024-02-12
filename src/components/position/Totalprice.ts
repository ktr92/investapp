export class Totalprice {
  constructor(public single: number = null, public count: number = null) {
    this.total = this.single * this.count
  }

  public total: number
}
