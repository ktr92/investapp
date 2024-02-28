import {Position} from '../components/position/Position'
import {moexTickerLast} from '../utils/getStockPrice'

interface IState {
  moex: Array<IMoexApi>,
  portfolio: Array<IPortfolio>
}

const state: IState = {
  moex: [],
  portfolio: [
    {
      id: 1,
      name: 'SBER',
      depo: 450000,
      comm: 0.06,
      positions: [
        {
          ticker: 'ASTR',
          buyPrice: 554,
          count: 100,
          myStop: 500,
        },
      ]
    },
    {
      id: 2,
      name: 'IIS',
      depo: 200000,
      comm: 0.06,
      positions: [
        {
          ticker: 'LKOH',
          buyPrice: 6990,
          count: 22,
          myStop: 7000,
        },
        {
          ticker: 'SVCB',
          buyPrice: 16,
          count: 15,
          myStop: 0,

        }
      ]
    },
    {
      id: 3,
      name: 'Finam',
      depo: 50000,
      comm: 0.065,

      positions: [
        {
          ticker: 'SVET',
          buyPrice: 32,
          count: 1000,
          myStop: 25,
        },
        {
          ticker: 'HYDR',
          buyPrice: 0.8885,
          count: 3000,
          myStop: 0.7000,
        },

      ]

    }
  ]
}

const mutations = {

}

const getters = {
  getAllPortfolio: () => state.portfolio,
  getPortfolio: (name: string) => state.portfolio.filter(item => item.name === name)[0],
  getPortfolioId: (name: string) => state.portfolio.filter(item => item.name === name)[0].id,
  getPortfolioName: (name: string) => state.portfolio.filter(item => item.name === name)[0].name,
  getPortfolioComm: (name: string) => state.portfolio.filter(item => item.name === name)[0].comm,
  getPortfolioDepo: (name: string) => state.portfolio.filter(item => item.name === name)[0].depo,
  getPortfolioPositions: (name: string) => state.portfolio.filter(item => item.name === name)[0].positions,
  getAllTickers: () => {
    const tickers: Array<string> = []
    state.portfolio.forEach(item => {
      item.positions.forEach(position => tickers.push(position.ticker))
    })
    return tickers
  },
  getMoex: () => state.moex
}

const actions = {
  initMoex: async () => {
    const tickers = getters.getAllTickers()
    state.moex = await moexTickerLast(tickers)
    return state.moex
  }
}

export default {getters, actions, state}

/* addDepo(cash) {
  depo += cash
},
reduceDepo(cash) {
  depo -= cash
},
getDepo() {
  return depo
},
addPosition(pos) {
  const exist = this.positions.filter(item => item.ticker === pos.ticker)
  if (exist.length === 1) {
    this.refreshPosition(exist, pos)
  } else {
    itemsCount += 1
    pos.id = itemsCount
    this.positions.push(pos)
  }
  depo -= pos.price * pos.count
},
refreshPosition(exist, pos) {
  const refresh = exist[0]
  refresh.price = (refresh.price * refresh.count + pos.price * pos.count) / (refresh.count + pos.count)
  refresh.count = refresh.count + pos.count
  refresh.stop = pos.stop
},
removePosition(pos) {
  this.positions.filter(item => item.id !== pos.id)
} */
