/** specific helper functions */

import {Store} from '../store/moex';

/**
 * @param {Store} state - the state of the app
 * @return {IListItem[]} - user's broker list */
export function getBrokerList(state: Store) {
  const all = state.getters.getAllPortfolio();
  const brokerLIst: Array<IListItem> = []

  all.forEach(broker => {
    brokerLIst.push({
      id: String(broker.id),
      text: broker.name,
      type: 'event'
    })
  })

  return brokerLIst
}

/**
 * @param {string} ticker - id of the item
 * @param {Store} state - the state of the app
 * @param {string} market - type of the item
 * @return {string} - a string represenring the logo url
 */
export function getItemLogo(ticker: string, state?: Store, market?: string) {
  if (market && market === 'TQOB') {
    return `https://mybroker.storage.bcs.ru/FinInstrumentLogo/${state.moexSecurities[market].filter((item) => item[0] === ticker)[0][28]}.png`
  } else {
    return `https://mybroker.storage.bcs.ru/FinInstrumentLogo/${ticker}.png`
  }
}
