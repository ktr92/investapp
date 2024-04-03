import {getUSD} from '../utils/currecyValue'
import {moexTickerLast} from '../utils/getStockPrice'

interface IState {
  moex: Array<IMoexApi>,
  portfolio: Array<IPortfolio>,
  currentPortfolio?: IPortfolio[]
}

export class Store {
  constructor() {
    this.portfolio = state.portfolio
    this.currency = []
    this.moex = {
      TQBR: [],
      TQCB: [],
      TQOB: []
    }
    this.moexSecurities ={
      TQBR: [],
      TQCB: [],
      TQOB: []
    }
    this.moexMarketData = {
      TQBR: [],
      TQCB: [],
      TQOB: []
    }
    this.moexSearch = {
      TQBR: [],
      TQCB: [],
      TQOB: []
    }
    this.currentPortfolio = []
  }

  public portfolio: Array<IPortfolio>
  public currentPortfolio: Array<IPortfolio>
  public moex: IMarketsApi
  public currency: Array<ICurrency>
  public moexBonds: Array<IMoexApi>
  public moexSecurities: IMarketsList
  public moexMarketData: IMarketsList
  public moexSearch: IMarketsList
  public marketList: Array<string>

  private mutations = {
    changeBroker: (id: number) => {
      this.currentPortfolio = []
      this.currentPortfolio.push(this.getters.getPortfolioById(id))
    },
    addPosition: (pfolioId: number, newPostion: IPosition, clone: boolean, market= 'TQBR') => {
      const pfolio = this.portfolio.filter(item => item.id === pfolioId)[0]
      const ispos = pfolio.markets[market].filter(item => item.ticker === newPostion.ticker)
      if (clone || !ispos.length) {
        pfolio.markets[market].push(newPostion)
      } else {
        const pos = ispos[0]
        pos.buyPrice = (newPostion.buyPrice * newPostion.count + pos.buyPrice * pos.count) / (newPostion.count + pos.count)
        pos.count += newPostion.count
      }
    }
  }

  public getters = {
    getAllPortfolio: () => this.portfolio,
    getPortfolio: (name: string) => this.portfolio.filter(item => item.name === name)[0],
    getPortfolioId: (name: string) => this.portfolio.filter(item => item.name === name)[0].id,
    getPortfolioById: (id: number) => this.portfolio.filter(item => item.id === id)[0],
    getPortfolioComm: (name: string) => this.portfolio.filter(item => item.name === name)[0].comm,
    getPortfolioDepo: (name: string) => this.portfolio.filter(item => item.name === name)[0].depo,
    getPortfolioPositions: (name: string, market = 'TQBR') => this.portfolio.filter(item => item.name === name)[0].markets[market],
    getAllTickers: (market: string) => {
      const tickers: Array<string> = []
      this.portfolio.forEach(item => {
        item.markets[market].forEach(position => tickers.push(position.ticker))
      })
      return {
        [market]: tickers
      }
    },
    getBondsTickers: () => {
      const tickers: Array<string> = []

      this.portfolio.forEach(item => {
        if (item.bonds) {
          item.bonds.forEach(position => tickers.push(position.ticker))
        }
      })
      return tickers
    },
    getCurrent: () => this.currentPortfolio,
    getmoexSecurities: () => this.moexSecurities,
    getmoexMarketData: () => this.moexMarketData,
    getMoexByName: (str: string,) => {
      const substr = str.toLocaleLowerCase()

      const list = this.moexSearch.moexSecurities.filter(item => {
        let searchField = ''
        if (typeof item[20] === 'string') {
          searchField = item[20]
        } else if (typeof item[28] === 'string') {
          searchField = item[28]
        } else if (typeof item[29] === 'string') {
          searchField = item[29]
        }

        return item[0].toLocaleLowerCase().includes(substr) || item[2].toLocaleLowerCase().includes(substr) || searchField.toLocaleLowerCase().includes(substr)
      })

      return list
    },
    getCurrency: (id: string) => this.currency.filter(item => item.id === id)[0].value,
    getMoexPrice: (ticker: string) => this.moexSearch.moexMarketData.filter(item => item[0] === ticker)[0],
    getMoexSearch: () => this.moexSearch,
    getMoex: () => this.moex
  }

  public actions = {
    initMoex: async () => {
      this.marketList = Object.keys(this.moex)
      await Promise.all(this.marketList.map(async (item) => {
        const tickers = this.getters.getAllTickers(item)
        if (tickers[item].length) {
          const moex = await moexTickerLast(item, tickers[item])
          this.moex[item] = moex.items
          this.moexSecurities[item] = moex.moexSecurities
          this.moexMarketData[item] = moex.moexMarketData
          return this.moex
        }
      }))

      return this.moex

      /*  const tickers = this.getters.getAllTickers()
      const moex = (await moexTickerLast(tickers))
      this.moex = moex.items
      this.moexList = moex.moexlist
      this.moexAll = moex.moexAll
      return this.moex */
    },

    initSearch: async (category: string) => {
      this.moexSearch = await moexTickerLast(category, [])
    },

    initCurrency: async () => {
      const usd = await getUSD()
      this.currency.push({
        id: 'usd',
        value: usd
      })
      return this.currency
    },
    changeBroker: (id: number) => {
      this.mutations.changeBroker(id)
    },
    addPosition: (id: number, pos: IPosition, clone?: boolean) => {
      this.mutations.addPosition(id, pos, clone)
    },

  }
}

const state: IState = {
  moex: [],
  portfolio: [
  /*   {
      id: 1,
      name: 'SBER',
      depo: 450000,
      comm: 0.06,
      markets: {
        TQCB: [
          {
            ticker: 'ASTR',
            type: 'stock',
            market: 'TQCB',
            buyPrice: 554,
            count: 100,
            myStop: 500,
          },
        ],
        TQOB: []
      }
    },
    {
      id: 2,
      name: 'IIS',
      depo: 200000,
      comm: 0.06,
      positions: [
        {
          ticker: 'LKOH',
          type: 'stock',
          market: 'TQCB',

          buyPrice: 6990,
          count: 22,
          myStop: 7000,
        },
        {
          ticker: 'SVCB',
          type: 'stock',
          market: 'TQCB',

          buyPrice: 16,
          count: 3000,
          myStop: 0,

        }
      ],
      bonds: [

      ]
    }, */
    {
      id: 3,
      name: 'Finam',
      depo: 50000,
      comm: 0.065,
      markets: {
        TQBR: [
          {
            ticker: 'SVET',
            type: 'stock',
            market: 'TQBR',
            buyPrice: 32,
            count: 1000,
            myStop: 25,
          },
          {
            ticker: 'HYDR',
            type: 'stock',
            market: 'TQBR',
            buyPrice: 0.8885,
            count: 3000,
            myStop: 0.7000,
          },
        ],
        TQCB: [
          {
            ticker: 'RU000A105A95',
            type: 'bonds',
            market: 'TQCB',

            buyPrice: 110,
            count: 1,
            nominal: 1000,
            currency: 'USD',
            buyCurrency: 90

          },
          {
            ticker: 'RU000A107B43',
            type: 'bonds',
            market: 'TQCB',

            buyPrice: 84,
            count: 2,
            nominal: 1000,
            currency: 'USD',
            buyCurrency: 92

          },
          {
            ticker: 'RU000A107B43',
            type: 'bonds',
            market: 'TQCB',
            buyPrice: 84,
            count: 1,
            nominal: 1000,
            currency: 'USD',
            buyCurrency: 88

          },
        ],
        TQOB: [
          {
            ticker: 'SU26238RMFS4',
            type: 'bonds',
            market: 'TQOB',
            buyPrice: 55,
            count: 1,
            nominal: 1000,
            currency: '',

          },
        ]
      },

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
