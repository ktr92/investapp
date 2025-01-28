/** @module Store */

import {mapMarket} from '../../utils/maps'
import {fetchCurrency} from '../../utils/currecyValue'
import {getSearchField, moexTickerLast} from '../../utils/getStockPrice'
import {Position} from '../../components/position/Position'
import {getPositionType} from '../../utils/getStockPrice'
import {Portfolio} from '../../components/Portfolio'
import calcSumm from '../../utils/calcSumm'
import numberWithSpaces from '../../utils/formatNumber'
import state from './state'

const tableData = () => {
  const currentData = state.portfolio.filter((item) => item.id === Store.currentDataID)

  const marketData = JSON.parse(localStorage.getItem('moexdata'))
  console.log(marketData)

  function marketMultBy(multiplier1: string, multiplier2: string) {
    let summ = 0
    Object.keys(marketData).map(key => {
      const datavalues: IPosition[] = marketData[key]
      if (datavalues.length < 1) {
        return 0
      }
      datavalues.forEach(value => {
        const m1 = value[multiplier1]
        const m2= value[multiplier2]
        if (typeof m1 === 'number' && typeof m2 === 'number') {
          summ += m1 * m2
        }
      })
      return summ
    })
    return summ
  }

  function multBy(multiplier1: string, multiplier2: string) {
    return currentData.reduce((prev, current) => {
      let summ = 0
      Object.keys(current.markets).map(key => {
        const datavalues = current.markets[key]
        if (datavalues.length < 1) {
          return 0
        }
        datavalues.forEach(value => {
          const m1 = value[multiplier1]
          const m2= value[multiplier2]
          if (typeof m1 === 'number' && typeof m2 === 'number') {
            summ += m1 * m2
          }
        })
        return summ
      })
      return summ
    }, 0)
  }

  function summBy(field: string) {
    return currentData.reduce((prev, current) => {
      let summ = 0
      Object.keys(current.markets).map(key => {
        const datavalues = current.markets[key]
        if (datavalues.length < 1) {
          return 0
        }
        datavalues.forEach(value => {
          const val = value[field]
          if (typeof val === 'number') {
            summ += val
          }
        })
        return summ
      })
      return summ
    }, 0)
  }

  return {
    columns: [
      {
        title: 'Актив',
        cell: 'stock',
        footer: 'Всего',
      },
      {
        title: 'Количество',
        cell: 'count',
        footer: numberWithSpaces(summBy('count')) +
          ' шт',
      },
      {
        title: 'Средняя цена',
        cell: 'startPrice',
        footer: '',
      },

      {
        title: 'НКД',
        cell: 'nkd',
        footer: '',
      },
      {
        title: 'Комиссия',
        cell: 'comm',
        footer: '',
      },
      {
        title: 'Вложено',
        cell: 'startTotal',
        footer: numberWithSpaces(multBy('buyPrice', 'count').toFixed(2)) +
        ' ₽',
      },
      {
        title: 'Текущая стоимость',
        cell: 'currentPrice',
        footer: numberWithSpaces(marketMultBy('price', '1'))
      },
      {
        title: 'Прибыль',
        cell: 'change',
        footer: '',
      },
      {
        title: '',
        cell: 'change',
        footer: '',
      },
      {
        title: '',
        cell: 'positionControl',
        footer: '',
      }
    ]
    /*  headers: ['Актив', 'Кол-во', 'Средняя цена', 'НКД', 'Комиссия', 'Вложено', 'Стоимость', 'Прибыль', '', ''],
  props: ['stock', 'count', 'startPrice', 'nkd', 'comm', 'startTotal', 'currentPrice', 'change', 'positionControl'],
  footers: ['Всего', 'count', '', '',] */
  }
}

export class Store {
  constructor() {
    this.portfolio = state.portfolio
    this.defaultPortfolio = this.portfolio[0].id
    this.defaultCategory = this.portfolio[0].defaultCategory
    ;(this.currency = []),
    (this.moex = {
      TQBR: [],
      TQCB: [],
      TQOB: [],
    })
    this.moexSecurities = {
      TQBR: [],
      TQCB: [],
      TQOB: [],
    }
    this.moexMarketData = {
      TQBR: [],
      TQCB: [],
      TQOB: [],
    }
    this.moexSearch = {
      TQBR: [],
      TQCB: [],
      TQOB: [],
    }
    this.currentPortfolio = []
  }

  static portfolioName: string
  static currentDataID: string

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
      if (id) {
        this.currentPortfolio.push(this.getters.getPortfolioById(id))
      }
    },
    addPosition: (
        pfolioId: string,
        newPostion: IPosition,
        clone: boolean,
        market: string
    ) => {
      const pfolio = this.portfolio.filter((item) => item.id === pfolioId)[0]
      const ispos = pfolio.markets[market].filter(
          (item) => item.positionId === newPostion.positionId
      )

      if (clone || !ispos.length) {
        pfolio.markets[market].push(newPostion)
      } else {
        const pos = ispos[0]
        pos.buyPrice =
          (newPostion.buyPrice * newPostion.count + pos.buyPrice * pos.count) /
          (newPostion.count + pos.count)
        pos.count += newPostion.count
      }
    },
    sellPosition: (
        pfolioId: string,
        newPostion: IPosition,
        clone: boolean,
        market: string
    ) => {
      const pfolio = this.portfolio.filter((item) => item.id === pfolioId)[0]
      const ispos = pfolio.markets[market].filter(
          (item) => item.positionId === newPostion.positionId
      )

      if (clone || !ispos.length) {
        pfolio.markets[market].push(newPostion)
      } else {
        const pos = ispos[0]
        pos.buyPrice =
          -(newPostion.buyPrice * newPostion.count + pos.buyPrice * pos.count) /
          (newPostion.count + pos.count)
        pos.count += newPostion.count
      }
    },
    editPosition: (id: string, newPostion: IPosition) => {
      const markets = Object.keys(this.moex)
      markets.forEach((market) => {
        this.portfolio.forEach((item) => {
          item.markets[market].forEach((pos) => {
            if (pos.positionId === newPostion.positionId) {
              pos.buyPrice = newPostion.buyPrice
              pos.count = newPostion.count
              pos.myStop = newPostion.myStop
              pos.buyCurrency = newPostion.buyCurrency
              pos.nkd = newPostion.nkd
            }
          })
        })
      })
    },
    salePosition: (id: string, newPostion: IPosition) => {
      const markets = Object.keys(this.moex)
      markets.forEach((market) => {
        this.portfolio.forEach((item) => {
          item.markets[market].forEach((pos) => {
            if (pos.positionId === newPostion.positionId) {
              pos.saleCount = newPostion.saleCount
              pos.salePrice = newPostion.salePrice
              pos.saleCurrency = newPostion.saleCurrency
              pos.saleNkd = newPostion.saleNkd
              pos.count -= newPostion.saleCount
              if (pos.count === 0) {
                pos.isSold = true
              }
            }
          })
        })
      })
    },
    deletePosition: (id: string, newPostion: IPosition) => {
      const markets = Object.keys(this.moex)
      markets.forEach((market) => {
        this.portfolio.forEach((item) => {
          item.markets[market] = item.markets[market].filter(
              (pos) => pos.positionId !== newPostion.positionId
          )
        })
      })
    },
  }

  static getStatic = {
    getTableData: () => tableData,
    getPortfolio: () => state.portfolio,
  }

  public getters = {
    getAllPortfolio: () => this.portfolio,
    getPortfolio: (name: string) =>
      this.portfolio.filter((item) => item.name === name)[0],
    getPortfolioId: (name: string) =>
      this.portfolio.filter((item) => item.name === name)[0].id,
    getPortfolioById: (id: string) =>
      this.portfolio.filter((item) => item.id === id)[0],
    getPortfolioComm: (name: string) =>
      this.portfolio.filter((item) => item.name === name)[0].comm,
    getPortfolioSumm: (id: string) =>
      this.portfolio.filter((item) => item.id === id)[0].defaultSumm,
    getPortfolioDepo: (name: string) =>
      this.portfolio.filter((item) => item.name === name)[0].depo,
    getCategory: (id: string) =>
      this.portfolio.filter((item) => item.id === id)[0].defaultCategory,

    getPortfolioPositions: (name: string, market = this.defaultCategory) =>
      this.portfolio.filter((item) => item.name === name)[0].markets[market],
    getAllTickers: (market: string) => {
      const tickers: Array<string> = []
      this.portfolio.forEach((item) => {
        item.markets[market].forEach((position) =>
          tickers.push(position.ticker)
        )
      })
      return {
        [market]: tickers,
      }
    },

    getPositionById: (id: string): IPosition => {
      const markets = Object.keys(this.moex)
      let position = null
      markets.forEach((market) => {
        this.portfolio.forEach((item) => {
          item.markets[market].forEach((pos) => {
            if (pos.positionId === id) {
              position = pos
            }
          })
        })
      })
      return position
    },

    getPortfolioByPositionId: (id: string) => {
      return this.getters.getPositionById(id).portfolioId
    },

    getCurrent: () => this.currentPortfolio,
    getMoexSecurities: () => this.moexSecurities,
    getMoexMarketData: () => this.moexMarketData,
    getMoexByName: (str: string) => {
      const substr = str.toLocaleLowerCase()

      const list = this.moexSearch.moexSecurities.filter((item) => {
        const searchField = getSearchField(item)

        return (
          item[0].toLocaleLowerCase().includes(substr) ||
          item[2].toLocaleLowerCase().includes(substr) ||
          searchField.toLocaleLowerCase().includes(substr)
        )
      })

      return list
    },
    getCurrency: (id: string) => {
      const isExist = this.currency.filter((item) => item.id === id)

      if (isExist && isExist[0]) {
        return isExist[0].value
      } else {
        return 1
      }
    },
    getMoexSearch: () => this.moexSearch,

    getData_moex: (
        ticker: string,
        category: string,
        fields: Array<string>
    ): IItem => {
      const mapField: IObjIndexable = {
        ticker: ticker,
        name: this.getters.getName_moex(ticker, category),
        fullname: this.getters.getFullName_moex(ticker, category),
        engname: this.getters.getEngName_moex(ticker, category),
        price: this.getters.getPrice_moex(ticker, category),
        startPrice: this.getters.getStartPrice_moex(ticker, category),
        currency: this.getters.getCurrency_moex(ticker, category),
        nominal: this.getters.getNominal_moex(ticker, category),
        nkd: this.getters.getNKD_moex(ticker, category),
      }

      return fields.reduce(
          (acc: IObjIndexable, field: string) => (
            (acc[field] = mapField[field]), acc
          ),
          {}
      ) as unknown as IItem
    },

    getPrice_moex: (ticker: string, category: string) => {
      const item = this.moexSearch.moexMarketData.filter(
          (item) => item[0] === ticker
      )[0]
      return Number(
        item[mapMarket()[category].priceIndex_1]
          ? item[mapMarket()[category].priceIndex_1]
          : item[mapMarket()[category].priceIndex_2]
      )
    },
    getName_moex: (ticker: string, category: string) => {
      return this.moexSearch.moexSecurities.filter(
          (item) => item[0] === ticker
      )[0][mapMarket()[category].nameIndex]
    },
    getFullName_moex: (ticker: string, category: string) => {
      return this.moexSearch.moexSecurities.filter(
          (item) => item[0] === ticker
      )[0][mapMarket()[category].fnameIndex]
    },
    getEngName_moex: (ticker: string, category: string) => {
      return this.moexSearch.moexSecurities.filter(
          (item) => item[0] === ticker
      )[0][mapMarket()[category].engnameIndex]
    },
    getStartPrice_moex: (ticker: string, category: string) => {
      return Number(
          this.moexSearch.moexMarketData.filter((item) => item[0] === ticker)[0][
              mapMarket()[category].openPriceIndex
          ]
      )
    },
    getNKD_moex: (ticker: string, category: string) => {
      return Number(
          this.moexSearch.moexSecurities.filter((item) => item[0] === ticker)[0][
              mapMarket()[category].nkdIndex
          ]
      )
    },
    getCurrency_moex: (ticker: string, category: string) => {
      return this.moexSearch.moexSecurities.filter(
          (item) => item[0] === ticker
      )[0][mapMarket()[category].currencyIndex]
    },
    getCurrencyValue_moex: (ticker: string, category: string) => {
      return (
        this.getters.getCurrency(
            this.moexSearch.moexSecurities.filter(
                (item) => item[0] === ticker
            )[0][mapMarket()[category].currencyIndex]
        ) || 1
      )
    },
    getNominal_moex: (ticker: string, category: string) => {
      return (
        Number(
            this.moexSearch.moexSecurities.filter(
                (item) => item[0] === ticker
            )[0][mapMarket()[category].nominalIndex]
        ) || 1
      )
    },
    getMoex: () => this.moex,
  }

  public actions = {
    getAction(name: string) {
      return this[name]
    },

    createPositions: (
        source: Array<IPortfolio>,
        state: Store
    ): Array<IPortfolioData> => {
      const result: Array<IPortfolioData> = []

      source.forEach((portfolio) => {
        let positions: Array<Position> = []
        Store.portfolioName = portfolio.name
        state.marketList.forEach((item) => {
          const positionType = getPositionType(item)
          if (portfolio.markets[item] && portfolio.markets[item].length) {
            const pp = new Portfolio(
                portfolio.id,
                portfolio.name,
                portfolio.depo,
                Position.createPosition(
                    portfolio.markets[item],
                    state,
                    positionType,
                    portfolio.comm,
                    item
                ),
                portfolio.comm
            )
            positions = positions.concat(pp.positions)
          }
        })

        result.push({
          name: Store.portfolioName,
          positions,
        })
      })
      return result
    },
    initMoex: async () => {
      this.marketList = Object.keys(this.moex)
      await Promise.all(
          this.marketList.map(async (item) => {
            const tickers = this.getters.getAllTickers(item)
            if (tickers[item].length) {
              const moex = await moexTickerLast(item, tickers[item])
              this.moex[item] = moex.items
              this.moexSecurities[item] = moex.moexSecurities
              this.moexMarketData[item] = moex.moexMarketData
              return this.moex
            }
          })
      )

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
    addPosition: (
        id: string,
        pos: IPosition,
        clone: boolean,
        market: string
    ) => {
      this.mutations.addPosition(id, pos, clone, market)
    },
    sellPosition: (
        id: string,
        pos: IPosition,
        clone: boolean,
        market: string
    ) => {
      this.mutations.sellPosition(id, pos, clone, market)
    },

    editPosition: (id: string, pos: IPosition) => {
      this.mutations.editPosition(id, pos)
    },
    deletePosition: (id: string, pos: IPosition) => {
      this.mutations.deletePosition(id, pos)
    },
    salePosition: (id: string, pos: IPosition) => {
      this.mutations.salePosition(id, pos)
    },
  }
}
