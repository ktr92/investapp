export class Stock implements IObjIndexable {
  constructor(public ticker: string, public name: string, public price: number, public change: number, public image: string) {}
  [index: string]: unknown
}
