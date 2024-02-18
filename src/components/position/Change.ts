export class Change implements IObjIndexable {
  constructor(public startValue: number, public currentValue: number) {}
  [index: string]: unknown

  render() {
    return `
      <div class="">
          <span class="w-auto block mr-3">
          <span class="block font-medium text-gray-900 whitespace-nowrap dark:text-white">${this.currentValue}</span>
          </span>
          <span>
            <span class="block  bg-primary-100 text-slate-400 text-xs font-medium rounded dark:bg-primary-900 dark:text-primary-300">${((this.currentValue - this.startValue)/this.startValue * 100).toFixed(2)}%</span>
            </span>  
      </div>
    `
  }
}
