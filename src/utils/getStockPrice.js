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

export function initPositionData(category, formdata) {
  let result = null
  if (category === 'TQBR') {
    result = {
      ticker: String(formdata.get('name')),
      type: 'stock',
      market: 'TQBR',
      buyPrice: Number(formdata.get('price')),
      count: Number(formdata.get('count')),
      myStop: Number(formdata.get('stop')),
    }
  }
  if (category === 'TQCB') {
    result = {
      ticker: String(formdata.get('name')),
      type: 'bonds',
      market: 'TQCB',
      buyPrice: Number(formdata.get('price')),
      count: Number(formdata.get('count')),
    }
  }
  if (category === 'TQOB') {
    result = {
      ticker: String(formdata.get('name')),
      type: 'bonds',
      market: 'TQOB',
      buyPrice: Number(formdata.get('price')),
      count: Number(formdata.get('count')),
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
