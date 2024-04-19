
import idGenerator from '../../utils/idGenerator'
import {TableComponent} from './TableComponent'
import {ViewComponent} from './ViewComponent'

const idgen = idGenerator()

export function renderTable(items: Array<TableComponent>, headers: Array<string>, footers: Array<unknown> | null = null): string {
  const header = renderHeader(headers)

  let footer = null
  if (footers) {
    footer = renderFooter(footers)
  }

  const tabid = {
    id: idgen.next().value
  }

  const table = `
    <section class="dark:bg-gray-900 py-3 sm:py-5" id=table${tabid.id}>
      <div class="mx-auto max-w-screen-2xl">
        <div class="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
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
    row += createCol(item, index, false, true)
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

  row += `<td>
    <a href="#" data-click="editItem" data-item="${}">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" version="1.1" id="Capa_1" width="20px" height="20px" viewBox="0 0 494.936 494.936" xml:space="preserve">
          <g>
            <g>
              <path fill="#fff" d="M389.844,182.85c-6.743,0-12.21,5.467-12.21,12.21v222.968c0,23.562-19.174,42.735-42.736,42.735H67.157    c-23.562,0-42.736-19.174-42.736-42.735V150.285c0-23.562,19.174-42.735,42.736-42.735h267.741c6.743,0,12.21-5.467,12.21-12.21    s-5.467-12.21-12.21-12.21H67.157C30.126,83.13,0,113.255,0,150.285v267.743c0,37.029,30.126,67.155,67.157,67.155h267.741    c37.03,0,67.156-30.126,67.156-67.155V195.061C402.054,188.318,396.587,182.85,389.844,182.85z"/>
              <path fill="#fff" d="M483.876,20.791c-14.72-14.72-38.669-14.714-53.377,0L221.352,229.944c-0.28,0.28-3.434,3.559-4.251,5.396l-28.963,65.069    c-2.057,4.619-1.056,10.027,2.521,13.6c2.337,2.336,5.461,3.576,8.639,3.576c1.675,0,3.362-0.346,4.96-1.057l65.07-28.963    c1.83-0.815,5.114-3.97,5.396-4.25L483.876,74.169c7.131-7.131,11.06-16.61,11.06-26.692    C494.936,37.396,491.007,27.915,483.876,20.791z M466.61,56.897L257.457,266.05c-0.035,0.036-0.055,0.078-0.089,0.107    l-33.989,15.131L238.51,247.3c0.03-0.036,0.071-0.055,0.107-0.09L447.765,38.058c5.038-5.039,13.819-5.033,18.846,0.005    c2.518,2.51,3.905,5.855,3.905,9.414C470.516,51.036,469.127,54.38,466.61,56.897z"/>
            </g>
          </g>
          </svg>
      </a>
    </td>`

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

function createCol(value: string | unknown, index: number, isheader = false, iscolor = false) {
  let newcol = `<td class="py-2 relative cursor-pointer font-medium text-gray-900 whitespace-nowrap dark:text-white ${isheader ? 'pl-2 pr-2 hover:text-[#00aff5] dark:hover:text-[#00aff5]' : ' px-2'}" data-sort="${index}" ${isheader ? `data-header="asc"` : ''}>`
  newcol += value
  newcol += '</td>'
  return newcol
}
