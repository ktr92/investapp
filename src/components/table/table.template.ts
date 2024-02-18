
import {TableComponent} from './TableComponent'
import {ViewComponent} from './ViewComponent'

export function renderTable(items: Array<TableComponent>, headers: Array<string>, footers: Array<unknown> | null = null): string {
  const rows: Array<string> = []

  items.forEach(item => {
    const row = createRow(item.props as Array<ViewComponent>)
    rows.push(row)
  })

  const header = renderRow(headers)

  let footer = null
  if (footers) {
    footer = renderFooter(footers)
  }

  const table = `
    <section class="bg-gray-50 dark:bg-gray-900 py-3 sm:py-5">
      <div class="px-4 mx-auto max-w-screen-2xl lg:px-12">
        <div class="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
        <table>
        <thead>${header}</thead>
        <tbody>${rows}</tbody>
        <tfoot>${footer ?? ''}</tfoot>
        </table>
        </div>
      </div>
    </section>
  `
  return table
}
function renderFooter(footer: Array<unknown>) {
  let row = '<tr class="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">'
  footer.forEach(item => {
    row += createCol(item)
  })
  row += '</tr>'
  return row
}
function renderRow(rows: Array<string>) {
  let row = '<tr class="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">'
  rows.forEach(item => {
    row += createCol(item)
  })
  row += '</tr>'
  return row
}

/* function createHeader() {
  return ''
} */
/* function createBody() {
  return ''
} */

function createRow(cols: Array<ViewComponent>) {
  let row = '<tr class="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">'

  cols.sort((a, b) => a.sort - b.sort)

  /*   cols.forEach(item => {
    row += createCol(item)
  }) */

  /* Object.keys(cols.props).forEach(key => {
    row += createCol((cols.props[key] as ViewComponent).render())
  }) */

  cols.forEach(item => {
    row += createCol((item as ViewComponent).render())
  })

  row += '</tr>'
  return row
}

function createCol(value: string | unknown) {
  let newcol = '<td class="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">'
  newcol += value
  newcol += '</td>'
  return newcol
}
