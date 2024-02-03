export class Position implements IObjIndexable {
  constructor(
    public name: string,
    public ticker:string,
    public buyPrice: number,
    public myStop: number = null,
    public salePrice: number = null
  ) {}

  [index: string]: unknown
}
