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
          price: market[index][3],
          open: security[index][3],
          nominal: security[index][38],
          currency: security[index][25]

        })
  })

  return result
}

export function getPrice(ticker, category, state) {
  let price = 0

  if (category === 'TQBR') {
    price = Number(state.getters.getMoexInfo(ticker)[12])
  }
  if (category === 'TQCB') {
    price = Number(state.getters.getMoexInfo(ticker)[11])
  }
  if (category === 'TQOB') {
    price = Number(state.getters.getMoexInfo(ticker)[11])
  }

  return price
}

export function initPositionData(category, formdata, moexSearch) {
  let result = null

  let price = Number(formdata.get('price'))
  let nominal = 1
  let buyCurrency = 1
  let currency = ''

  if (category === 'TQBR') {
    result = {
      ticker: String(formdata.get('name')),
      type: 'stock',
      market: 'TQBR',
      buyPrice: price,
      count: Number(formdata.get('count')),
      myStop: Number(formdata.get('stop')),
    }
  }
  if (category === 'TQCB') {
    const moexData = moexSearch.filter(item => item[0] === String(formdata.get('name')))[0]
    buyCurrency = Number(formdata.get('currencyValue'))
    nominal = moexData[38]
    currency = moexData[25]
    price = Number(formdata.get('price'))
    result = {
      ticker: String(formdata.get('name')),
      type: 'bonds',
      market: 'TQCB',
      buyPrice: price,
      count: Number(formdata.get('count')),
      buyCurrency: buyCurrency,
      currency: currency,
      nominal: nominal
    }
  }
  if (category === 'TQOB') {
    const moexData = moexSearch.filter(item => item[0] === String(formdata.get('name')))[0]
    nominal = moexData[38]
    price = Number(formdata.get('price'))
    result = {
      ticker: String(formdata.get('name')),
      type: 'bonds',
      market: 'TQOB',
      buyPrice: price,
      count: Number(formdata.get('count')),
      nominal: nominal

    }
  }
  if (category === 'cash') {
    result = {
      ticker: 'cash',
      type: 'cash',
      market: '',
      buyPrice: Number(formdata.get('price')),
      count: 1,
    }
  }

  return result
}

export function getSearchField(item) {
  let searchField = ''
  if (typeof item[20] === 'string') {
    searchField = item[20]
  } else if (typeof item[28] === 'string' && typeof item[29] === 'string') {
    searchField = item[28] + item[29]
  } else if (typeof item[28] === 'string') {
    searchField = item[28]
  } else if (typeof item[29] === 'string') {
    searchField = item[29]
  }

  return searchField
}

export function getPositionType(item) {
  let positionType = null
  if (item === 'TQBR') {
    positionType = 'stock'
  }
  if (item === 'TQCB') {
    positionType = 'bonds'
  }
  if (item === 'TQOB') {
    positionType = 'bonds'
  }

  return positionType
}
