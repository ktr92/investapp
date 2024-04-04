import {Store} from '../store';

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
