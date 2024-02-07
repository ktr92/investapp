import {Stock} from '../Stock'
import {TableStock} from './TableStock'

export function renderTable(items: Array<IObjIndexable>): string {
  const rows = []

  for (let i = 0; i < items.length; i++) {
    const row = createRow(items[i])
    rows.push(row)
  }

  const table = `
    <section class="bg-gray-50 dark:bg-gray-900 py-3 sm:py-5">
      <div class="px-4 mx-auto max-w-screen-2xl lg:px-12">
        <div class="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
        <table><tbody>${rows}</tbody></table>
        </div>
      </div>
    </section>
  `
  return table
}

/* function createHeader() {
  return ''
} */
/* function createBody() {
  return ''
} */

function createRow(cols: IObjIndexable) {
  let row = '<tr class="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">'

  Object.keys(cols).forEach(key => {
    row += createCol(cols[key])
  })

  row += '</tr>'
  return row
}

function createCol(value: unknown) {
  let newcol = null
  console.log(value)
  if (value instanceof Stock) {
    const stock = new TableStock(value)
    newcol = `<td class="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"> 
      ${stock.render()}
      `
  } else {
    newcol = ` 
    <td class="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">${value ? value : ''}</td>
  `
  }
  return newcol
}

/* function createCell() {
  return ''
} */
