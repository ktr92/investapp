export class Stock {
  constructor(
    public name: string,
    public ticker:string,
    public currentPrice: number,
    public buyPrice: number,
    public salePrice: number = null
  ) {}
}
