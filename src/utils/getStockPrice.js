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
  if (market === 'TQBR') {
    items = moexTransformer(fMarketdata, fSecurities, indexes)
  } else {
    items = moexBondsTransformer(fMarketdata, fSecurities, indexes)
  }

  return {
    items,
    moexSecurities: fSecurities,
    moexMarketData: fMarketdata
  }
}

function moexTransformer(market, security, indexes) {
  const result = []
  indexes.forEach(index => {
    result.push(
        {
          name: security[index][2],
          ticker: market[index][0],
          price: market[index][12],
          open: security[index][3],
          currency: security[index][25]
        })
  })

  return result
}
function moexBondsTransformer(market, security, indexes) {
  const result = []
  indexes.forEach(index => {
    result.push(
        {
          name: security[index][2],
          ticker: market[index][0],
          price: market[index][11],
          open: security[index][3],
          nominal: security[index][38],
          currency: security[index][25]

        })
  })

  return result
}

export function moexDataInit(state, category, ticker) {
  const marketData = state.getters.getMoexSearch().moexMarketData.filter(item => item[0] === ticker)[0]
  const securityData = state.getters.getMoexSearch().moexSecurities.filter(item => item[0] === ticker)[0]
  console.log(securityData)
  if (marketData && securityData) {
    let result = null
    if (marketData && securityData) {
    /*   result = mapMarket(marketData, securityData)[category].data */
      result = {
        ticker: marketData[mapMarket()[category].tickerIndex],
        name: securityData[mapMarket()[category].nameIndex],
        fullname: securityData[mapMarket()[category].fnameIndex],
        engname: securityData[mapMarket()[category].engnameIndex],
        price: marketData[mapMarket()[category].priceIndex_1] ?? marketData[mapMarket()[category].priceIndex_2],
        startPrice: marketData[mapMarket()[category].openPriceIndex],
        currency: securityData[mapMarket()[category].currencyIndex],
        nominal: securityData[mapMarket()[category].nominalIndex],
      }
    }
    return result
  }
}

export function initPositionData(category, formdata, moexSearch) {
  let result = null
  const moexData = moexSearch.filter(item => item[0] === String(formdata.get('name')))[0]
  const nominal = moexData[mapMarket()[category].nominalIndex]
  const currency = moexData[mapMarket()[category].currencyIndex]

  const price = Number(formdata.get('price'))

  const buyCurrency = Number(formdata.get('currencyValue')) ? Number(formdata.get('currencyValue')) : 1

  result = {
    ticker: String(formdata.get('name')),
    type: mapMarket()[category].type,
    market: category,
    buyPrice: price,
    count: Number(formdata.get('count')),
    buyCurrency,
    currency: currency,
    nominal: nominal
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
