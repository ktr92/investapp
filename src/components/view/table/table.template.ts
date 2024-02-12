import {Price} from '../../position/Price'
import {Stock} from '../../position/Stock'
import {Change} from '../../position/Change'
import {Totalprice} from '../../position/Totalprice'
import {TableChange} from '../TableChange'
import {TablePrice} from '../TablePrice'
import {TableStock} from '../TableStock'
import {TableTotal} from '../TableTotal'
import {TableCount} from '../TableCount'
import {Count} from '../../position/Count'
import {TableComponent} from './TableComponent'

export function renderTable(items: Array<TableComponent>): string {
  const rows = []

  items.forEach((item) => {
    row = createRow(item)
    rows.push(row)
  })

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

  const cells: Array<TableComponent> = []

  Object.keys(cols).forEach(key => {
    row += createCol(cols[key], cells)
  })

  console.log(cells)

  row += '</tr>'
  return row
}

function createCol(value: unknown, cells: Array<TableComponent>) {
  let newcol = '<td class="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">'

  return newcol += '</td>'
}

/* function createCell() {
  return ''
} */
