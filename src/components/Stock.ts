export class Stock implements IObjIndexable {
  constructor(
    public name: string,
    public ticker:string,
    public currentPrice: number,
    public buyPrice: number,
    public salePrice: number = null
  ) {}

  [index: string]: unknown
}
