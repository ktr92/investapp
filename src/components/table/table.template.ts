
import {TableComponent} from './TableComponent'

export function renderTable(items: Array<Array<TableComponent>>): string {
/*   console.log(items) */

  const rows: Array<string> = []

  items.forEach(item => {
    const row = createRow(item)
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

function createRow(cols: Array<TableComponent>) {
  let row = '<tr class="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">'

  cols.sort((a, b) => a.sort - b.sort)

  cols.forEach(item => {
    row += createCol(item)
  })

  row += '</tr>'
  return row
}

function createCol(value: TableComponent) {
  let newcol = '<td class="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">'
  newcol += value.render()
  newcol += '</td>'
  return newcol
}

/* function createCell() {
  return ''
} */
