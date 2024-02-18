
import {TableComponent} from './TableComponent'
import {ViewComponent} from './ViewComponent'

export function renderTable(items: Array<TableComponent>): string {
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

function createRow(cols: TableComponent) {
  let row = '<tr class="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">'

  console.log(cols)

  /*   cols.sort((a, b) => a.sort - b.sort) */

  /*   cols.forEach(item => {
    row += createCol(item)
  }) */

  Object.keys(cols.props).forEach(key => {
    row += createCol((cols.props[key] as ViewComponent).render())
  })

  row += '</tr>'
  return row
}

function createCol(value: string) {
  let newcol = '<td class="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">'
  newcol += value
  newcol += '</td>'
  return newcol
}
