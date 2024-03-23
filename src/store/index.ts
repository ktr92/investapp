import {Position} from '../components/position/Position'
import {moexTickerLast} from '../utils/getStockPrice'

interface IState {
  moex: Array<IMoexApi>,
  portfolio: Array<IPortfolio>,
  currentPortfolio?: IPortfolio
}

export class Store {
  constructor() {
    this.portfolio = state.portfolio
  }

  public portfolio: Array<IPortfolio>
  public currentPortfolio: IPortfolio
  public moex: Array<IMoexApi>

  private mutations = {
    changeBroker: (id: number) => {
      this.currentPortfolio = this.getters.getPortfolioById(id)
    }
  }

  public getters = {
    getAllPortfolio: () => this.portfolio,
    getPortfolio: (name: string) => this.portfolio.filter(item => item.name === name)[0],
    getPortfolioId: (name: string) => this.portfolio.filter(item => item.name === name)[0].id,
    getPortfolioById: (id: number) => this.portfolio.filter(item => item.id === id)[0],
    getPortfolioComm: (name: string) => this.portfolio.filter(item => item.name === name)[0].comm,
    getPortfolioDepo: (name: string) => this.portfolio.filter(item => item.name === name)[0].depo,
    getPortfolioPositions: (name: string) => this.portfolio.filter(item => item.name === name)[0].positions,
    getAllTickers: () => {
      const tickers: Array<string> = []
      this.portfolio.forEach(item => {
        item.positions.forEach(position => tickers.push(position.ticker))
      })
      return tickers
    },
    getMoex: () => this.moex
  }

  public actions = {
    initMoex: async () => {
      const tickers = this.getters.getAllTickers()
      this.moex = await moexTickerLast(tickers)
      return this.moex
    },
    changeBroker: (id: number) => {
      this.mutations.changeBroker(id)
    }
  }
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
          count: 3000,
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

/* export default {getters, actions, state} */

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
