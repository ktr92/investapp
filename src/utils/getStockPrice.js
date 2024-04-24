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
          price: market[index][mapMarket()[category].priceIndex_1] ? market[index][mapMarket()[category].priceIndex_1] : security[index][mapMarket()[category].priceIndex_2],
          open: security[index][mapMarket()[category].openPriceIndex],
          currency: security[index][mapMarket()[category].openPriceIndex],
          nominal: security[index][mapMarket()[category].nominalIndex],
        })
  })

  return result
}

export function initFormData(category, formdata, moexSearch, portfolio, positionId = null) {
  const moexData = moexSearch.filter(item => item[0] === String(formdata.get('name')))[0]
  let nominal = 1
  if (mapMarket()[category].nominalIndex) {
    nominal = moexData[mapMarket()[category].nominalIndex]
  }
  const currency = moexData[mapMarket()[category].currencyIndex]

  const price = Number(formdata.get('price'))

  const buyCurrency = Number(formdata.get('currencyValue')) ? Number(formdata.get('currencyValue')) : 1

  let posId = String(new Date().valueOf())
  if (positionId && !formdata.get('isclone')) {
    posId = positionId
  }

  const result = {
    ticker: String(formdata.get('name')),
    type: mapMarket()[category].type,
    market: category,
    buyPrice: price,
    count: Number(formdata.get('count')),
    buyCurrency: buyCurrency,
    currency: currency,
    nominal: nominal,
    nkd: Number(formdata.get('nkd')) || 0,
    positionId: posId,
    portfolioId: String(portfolio)
  }

  return result
}

export function getSearchField(item) {
  return String(item[20] ?? '') + String(item[28] ?? '') + String(item[29] ?? '')
}

export function getPositionType(item) {
  return mapMarket()[item].type
}
