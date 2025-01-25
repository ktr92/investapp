
import idGenerator from '../../utils/idGenerator'
import {TableComponent} from './TableComponent'
import {ViewComponent} from './ViewComponent'
import {Store} from '../../store';

const idgen = idGenerator()

export function renderTable(items: Array<TableComponent>, headers: Array<string>, footers: Array<unknown> | null = null, tablename?: string): string {
  const header = renderHeader(headers)

  let footer = null
  if (footers) {
    footer = renderFooter(footers)
  }

  const tabid = {
    id: idgen.next().value
  }

  const table = ` 
    <section class="w-full dark:bg-slate-800 py-3 sm:py-5" id=table${tabid.id}>
      <div class="w-full mx-auto px-8">
      <h2 class="text-2xl font-bold mb-4 dark:text-white">${tablename || '' }</h2>
        <div class="w-full relative bg-white dark:bg-slate-800">
        <table class="w-full">
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

export function renderBody(root: HTMLElement, items: Array<TableComponent>) {
  const rows: Array<string> = []

  root.querySelector('tbody').innerHTML = ''
  items.forEach(item => {
    const row = createRow(item.props as Array<ViewComponent>)
    rows.push(row)
  })

  root.querySelector('tbody').insertAdjacentHTML('afterbegin', rows.join(''))
}

function renderHeader(header: Array<unknown>) {
  let row = `<tr class="border-b bg-slate-100 dark:bg-slate-700 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700">`
  let index = 0

  header.forEach(item => {
    row += createCol(item, index, true)
    index += 1
  })
  row += '</tr>'
  return row
}
function renderFooter(footer: Array<unknown>) {
  let row = '<tr class="border-b dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700">'
  let index = 0
  footer.forEach(item => {
    row += createCol(item, index, false, true)
    index += 1
  })
  row += '</tr>'
  return row
}

function createRow(cols: Array<ViewComponent>) {
  let row = '<tr class="border-b dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700">'

  cols.sort((a, b) => a.sort - b.sort)
  let index = 0
  cols.forEach(item => {
    row += createCol((item as ViewComponent).render(), index)

    index += 1
  })

  row += '</tr>'
  return row
}

function createCol(value: string | unknown, index: number, isheader = false, iscolor = false) {
  let newcol = `<td class=" py-2 relative cursor-pointer font-medium text-slate-900 whitespace-nowrap dark:text-white ${isheader ? 'pl-4 pr-4 hover:text-[#00aff5] dark:hover:text-[#00aff5]' : ' px-4'}" data-sort="${index}" ${isheader ? `data-header="asc"` : ''}>`
  newcol += value
  newcol += '</td>'
  return newcol
}
