export class Price implements IObjIndexable {
  constructor(public value: number, public count: number = 1) {}
  [index: string]: unknown
}
