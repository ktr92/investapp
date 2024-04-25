export function renderClone() {
  return `
  <div class="flex items-center mb-4" data-input="clone" data-mode=""  data-mode-create="" data-mode-edit="">
      <input id="isclone" name="isclone" type="checkbox" value="isclone"
          class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-500 dark:border-gray-600 " />

      <label for="isclone" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">
          Clone ?
      </label>
  </div>`
}

export function renderSubmit() {
  return `
    <div class="flex items-center">
      <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Confirm
      </button>
      <div class="pl-4" data-result="total">0 </div>&nbsp;₽
    </div>
  `
}

export function renderBroker(selectBroker: string) {
  return `
    <div class="sm:col-span-2 mb-4"  data-mode=""  data-mode-create="">
        <label for="portfolio" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select portfolio</label>
        <select id="portfolio" name="portfolio" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
          ${selectBroker}
        </select>
    </div>
    `
}
export function renderCategory() {
  return `
    <div class="sm:col-span-2 mb-4"  data-mode=""  data-mode-create="">
      <label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Type</label>
      <select id="category" name="category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
        <option value="TQBR">Stocks</option>
        <option value="TQCB">Corporative Bonds</option>
        <option value="TQOB">Bonds</option>
      </select>
  </div>
    `
}
export function renderSearch() {
  const custom = `<div  class="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute hidden" data-dropdown='name'></div>`
  return renderInput('name', 'text', 'Название', '', '', '', 'Тикер, наименование', custom)
}

export function renderTextarea(id: string, title: string, rows: number | string, placeholder?: string, attrBlock?:string, attrInput?: string, value?: string | number) {
  return `
    <div class="sm:col-span-2 mb-4"${attrBlock}>
        <label for="${id}" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">${title}</label>
        <textarea id="${id}" ${attrInput}  rows="${rows}" class="block p-1 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="${placeholder}">${value}</textarea>
    </div>
  `
}

export function renderInput(id: string, type: string, title: string, value?: string | number, attrBlock?: string, attrInput?: string, placeholder?: string, customHTML?: string, classes?: string) {
  return `
    <div class="w-full  mb-4 ${classes}" ${attrBlock}>
        <label for="${id}" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">${title}</label>
        <input ${attrInput} step="0.000000001" value="${value}"  type="${type}" name="${id}" id="${id}" autocomplete="off" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="${placeholder}" >
        ${customHTML ? customHTML : ''}
    </div>
  `
}

export function initTemplate(formContent: string) {
  return `
        <div id="modalLoader" class="hidden loader absolute w-full h-full flex items-center justify-center left-0 right-0 top-0 bottom-0 z-40 bg-[rgba(233,233,233,0.2)]">
          <div role="status">
              <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span class="sr-only">Loading...</span>
          </div>
        </div>
      ${formContent}
     </div>
  `
}
