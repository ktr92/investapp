export class Change implements IObjIndexable {
  constructor(public startValue: number, public currentValue: number) {}
  [index: string]: unknown
}
