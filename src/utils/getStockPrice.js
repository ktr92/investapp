import {mapMarket} from './maps'

export async function moexTickerLast(market, tickers) {
  let url = ''

  let query = tickers.join(',')

  if (query.length) {
    query = '?securities=' + query
  }

  if (market === 'TQBR') {
    url = `https://iss.moex.com/iss/engines/stock/markets/shares/boards/${market}/securities.json${query}`
  } else {
    url = `https://iss.moex.com/iss/engines/stock/markets/bonds/boards/${market}/securities.json${query}`
  }

  const json = await fetch(url)
      .then((res) => {
        return res.json()
      });

  const fMarketdata = json.marketdata.data
  const fSecurities = json.securities.data

  const indexes = []

  fMarketdata.forEach((element, index) => {
    if (tickers.indexOf(element[0]) > -1) {
      indexes.push(index)
    }
  });

  let items = null

  items = moexTransformer(fMarketdata, fSecurities, indexes, market)

  return {
    items,
    moexSecurities: fSecurities,
    moexMarketData: fMarketdata
  }
}

function moexTransformer(market, security, indexes, category) {
  const result = []
  indexes.forEach(index => {
    result.push(
        {
          name: security[index][mapMarket()[category].nameIndex],
          ticker: market[index][mapMarket()[category].tickerIndex],
          price: market[index][mapMarket()[category].priceIndex_1] ? market[index][mapMarket()[category].priceIndex_1] : market[index][mapMarket()[category].priceIndex_2],
          open: security[index][mapMarket()[category].openPriceIndex],
          currency: security[index][mapMarket()[category].openPriceIndex],
          nominal: security[index][mapMarket()[category].nominalIndex],
        })
  })

  return result
}

/* export function moexDataInit(state, category, ticker) {
  const marketData = state.getters.getMoexSearch().moexMarketData.filter(item => item[0] === ticker)[0]
  const securityData = state.getters.getMoexSearch().moexSecurities.filter(item => item[0] === ticker)[0]
  if (marketData && securityData) {
    let result = null
    if (marketData && securityData) {
      result = {
        ...state.getters.getData_moex(ticker, category, ['ticker', 'name', 'fullname', 'engname', 'price', 'startPrice', 'currency', 'nominal'])
      }
    }
    return result
  }
} */

export function initFormData(category, formdata, moexSearch) {
  let result = null
  const moexData = moexSearch.filter(item => item[0] === String(formdata.get('name')))[0]
  let nominal = 1
  if (mapMarket()[category].nominalIndex) {
    nominal = moexData[mapMarket()[category].nominalIndex]
  }
  const currency = moexData[mapMarket()[category].currencyIndex]

  console.log(moexData)

  const price = Number(formdata.get('price'))

  const buyCurrency = Number(formdata.get('currencyValue')) ? Number(formdata.get('currencyValue')) : 1

  result = {
    ticker: String(formdata.get('name')),
    type: mapMarket()[category].type,
    market: category,
    buyPrice: price,
    count: Number(formdata.get('count')),
    buyCurrency: buyCurrency,
    currency: currency,
    nominal: nominal,
    nkd: Number(formdata.get('nkd')) || 0,
  }
  if (category === 'cash') {
    result = {
      ticker: 'cash',
      type: 'cash',
      market: '',
      buyPrice: price,
      count: 1,
    }
  }

  return result
}

export function getSearchField(item) {
  return String(item[20] ?? '') + String(item[28] ?? '') + String(item[29] ?? '')
}

export function getPositionType(item) {
  return mapMarket()[item].type
}
