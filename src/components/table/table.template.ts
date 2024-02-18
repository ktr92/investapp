
import {TableComponent} from './TableComponent'
import {ViewComponent} from './ViewComponent'

export function renderTable(items: Array<TableComponent>, headers: Array<string>, footers: Array<unknown> | null = null): string {
  const header = renderHeader(headers)

  let footer = null
  if (footers) {
    footer = renderFooter(footers)
  }

  const table = `
    <section class="bg-gray-50 dark:bg-gray-900 py-3 sm:py-5">
      <div class="px-4 mx-auto max-w-screen-2xl lg:px-12">
        <div class="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
        <table>
        <thead>${header ?? ''}</thead>
        <tbody></tbody>
        <tfoot>${footer ?? ''}</tfoot>
        </table>
        </div>
      </div>
    </section>
  `
  return table
}

export function renderBody(items: Array<TableComponent>) {
  const rows: Array<string> = []

  document.querySelector('tbody').innerHTML = ''
  items.forEach(item => {
    const row = createRow(item.props as Array<ViewComponent>)
    rows.push(row)
  })

  document.querySelector('tbody').insertAdjacentHTML('afterbegin', rows.join(''))
}

function renderHeader(header: Array<unknown>) {
  let row = `<tr class="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">`
  let index = 0

  header.forEach(item => {
    row += createCol(item, index, true)
    index += 1
  })
  row += '</tr>'
  return row
}
function renderFooter(footer: Array<unknown>) {
  let row = '<tr class="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">'
  let index = 0
  footer.forEach(item => {
    row += createCol(item, index)
    index += 1
  })
  row += '</tr>'
  return row
}

function createRow(cols: Array<ViewComponent>) {
  let row = '<tr class="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">'

  cols.sort((a, b) => a.sort - b.sort)
  let index = 0
  cols.forEach(item => {
    row += createCol((item as ViewComponent).render(), index)
    index += 1
  })

  row += '</tr>'
  return row
}

/* function renderRow(rows: Array<string>) {
  let row = '<tr class="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">'
  rows.forEach(item => {
    row += createCol(item)
  })
  row += '</tr>'
  return row
} */

function createCol(value: string | unknown, index: number, isheader = false) {
  let newcol = `<td class="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white" data-sort="${index}" ${isheader ? `data-header="${index}"` : ''}>`
  newcol += value
  newcol += '</td>'
  return newcol
}
