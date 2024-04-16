import {mapMarket} from '../utils/maps'
import {fetchCurrency} from '../utils/currecyValue'
import {getSearchField, moexTickerLast} from '../utils/getStockPrice'

interface IState {
  moex: Array<IMoexApi>,
  portfolio: Array<IPortfolio>,
  currentPortfolio?: IPortfolio[]
}

export class Store {
  constructor() {
    this.portfolio = state.portfolio
    this.defaultPortfolio = this.portfolio[0].id
    this.defaultCategory = this.portfolio[0].defaultCategory
    this.currency = [],

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
  public defaultPortfolio: string
  public defaultCategory: string
  public currentPortfolio: Array<IPortfolio>
  public moex: IMarketsApi
  public currency: Array<ICurrency>
  public moexBonds: Array<IMoexApi>
  public moexSecurities: IMarketsList
  public moexMarketData: IMarketsList
  public moexSearch: IMarketsList
  public marketList: Array<string>

  private mutations = {
    changeBroker: (id: string) => {
      this.currentPortfolio = []
      this.currentPortfolio.push(this.getters.getPortfolioById(id))
    },
    addPosition: (pfolioId: string, newPostion: IPosition, clone: boolean, market: string) => {
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
    getPortfolioById: (id: string) => this.portfolio.filter(item => item.id === id)[0],
    getPortfolioComm: (name: string) => this.portfolio.filter(item => item.name === name)[0].comm,
    getPortfolioSumm: (id: string) => this.portfolio.filter(item => item.id === id)[0].defaultSumm,
    getPortfolioDepo: (name: string) => this.portfolio.filter(item => item.name === name)[0].depo,
    getCategory: (id: string) => this.portfolio.filter(item => item.id === id)[0].defaultCategory,

    getPortfolioPositions: (name: string, market = this.defaultCategory) => this.portfolio.filter(item => item.name === name)[0].markets[market],
    getAllTickers: (market: string) => {
      const tickers: Array<string> = []
      this.portfolio.forEach(item => {
        item.markets[market].forEach(position => tickers.push(position.ticker))
      })
      return {
        [market]: tickers
      }
    },

    getCurrent: () => this.currentPortfolio,
    getMoexSecurities: () => this.moexSecurities,
    getMoexMarketData: () => this.moexMarketData,
    getMoexByName: (str: string) => {
      const substr = str.toLocaleLowerCase()

      const list = this.moexSearch.moexSecurities.filter(item => {
        const searchField = getSearchField(item)

        return item[0].toLocaleLowerCase().includes(substr) || item[2].toLocaleLowerCase().includes(substr) || searchField.toLocaleLowerCase().includes(substr)
      })

      return list
    },
    getCurrency: (id: string) => {
      const isExist = this.currency.filter(item => item.id === id)

      if (isExist && isExist[0]) {
        return isExist[0].value
      } else {
        return 1
      }
    },
    getMoexSearch: () => this.moexSearch,

    getData_moex: (ticker: string, category: string, fields: Array<string>): IItem => {
      const mapField: IObjIndexable = {
        'ticker': ticker,
        'name': this.getters.getName_moex(ticker, category),
        'fullname': this.getters.getFullName_moex(ticker, category),
        'engname': this.getters.getEngName_moex(ticker, category),
        'price': this.getters.getPrice_moex(ticker, category),
        'startPrice': this.getters.getStartPrice_moex(ticker, category),
        'currency': this.getters.getCurrency_moex(ticker, category),
        'nominal': this.getters.getNominal_moex(ticker, category),
        'nkd': this.getters.getNKD_moex(ticker, category),
      }

      return fields.reduce((acc: IObjIndexable, field: string) => (acc[field] = mapField[field], acc),
          {}
      ) as unknown as IItem
    },

    getPrice_moex: (ticker: string, category: string) => {
      const item = this.moexSearch.moexMarketData.filter(item => item[0] === ticker)[0]
      return Number(item[mapMarket()[category].priceIndex_1] ? item[mapMarket()[category].priceIndex_1] :item[mapMarket()[category].priceIndex_2])
    },
    getName_moex: (ticker: string, category: string) => {
      return this.moexSearch.moexSecurities
          .filter(item => item[0] === ticker)[0][mapMarket()[category].nameIndex]
    },
    getFullName_moex: (ticker: string, category: string) => {
      return this.moexSearch.moexSecurities
          .filter(item => item[0] === ticker)[0][mapMarket()[category].fnameIndex]
    },
    getEngName_moex: (ticker: string, category: string) => {
      return this.moexSearch.moexSecurities
          .filter(item => item[0] === ticker)[0][mapMarket()[category].engnameIndex]
    },
    getStartPrice_moex: (ticker: string, category: string) => {
      return Number(this.moexSearch.moexMarketData
          .filter(item => item[0] === ticker)[0][mapMarket()[category].openPriceIndex])
    },
    getNKD_moex: (ticker: string, category: string) => {
      return Number(this.moexSearch.moexSecurities
          .filter(item => item[0] === ticker)[0][mapMarket()[category].nkdIndex])
    },
    getCurrency_moex: (ticker: string, category: string) => {
      return this.moexSearch.moexSecurities
          .filter(item => item[0] === ticker)[0][mapMarket()[category].currencyIndex]
    },
    getCurrencyValue_moex: (ticker: string, category: string) => {
      return this.getters.getCurrency(this.moexSearch.moexSecurities
          .filter(item => item[0] === ticker)[0][mapMarket()[category].currencyIndex]) || 1
    },
    getNominal_moex: (ticker: string, category: string) => {
      return Number(this.moexSearch.moexSecurities
          .filter(item => item[0] === ticker)[0][mapMarket()[category].nominalIndex]) || 1
    },
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

      return {...this.moex}
    },

    initSearch: async (category: string) => {
      this.moexSearch = await moexTickerLast(category, [])
      return {...this.moexSearch}
    },

    initCurrency: async () => {
      this.currency = await fetchCurrency()
      return [...this.currency]
    },
    changeBroker: (id: string) => {
      this.mutations.changeBroker(id)
    },
    addPosition: (id: string, pos: IPosition, clone: boolean, market: string) => {
      this.mutations.addPosition(id, pos, clone, market)
    },

  }
}

const state: IState = {
  moex: [],
  portfolio: [
    {
      id: '1',
      name: 'SBER',
      depo: 450000,
      comm: 0.09,
      defaultSumm: 50000,
      defaultCategory: 'TQBR',
      markets: {
        TQBR: [
          {
            ticker: 'ASTR',
            type: 'stock',
            market: 'TQBR',
            buyPrice: 554,
            count: 100,
            myStop: 500,
          },
        ],
        TQCB: [
        ],
        TQOB: []
      }
    },
    {
      id: '2',
      name: 'IIS',
      depo: 200000,
      comm: 0.09,
      defaultSumm: 50000,
      defaultCategory: 'TQBR',
      markets: {
        TQBR: [
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
        TQCB: [
        ],
        TQOB: []
      }

    },
    {
      id: '3',
      name: 'Finam',
      depo: 500000,
      comm: 0.095,
      defaultSumm: 50000,
      defaultCategory: 'TQBR',
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
            nkd: 10,
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
            nkd: 13,
            buyPrice: 84,
            count: 2,
            nominal: 1000,
            currency: 'USD',
            buyCurrency: 92

          },
          {
            ticker: 'RU000A107B43',
            type: 'bonds',
            nkd: 11,
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
            nkd: 7,
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
