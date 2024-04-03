export async function moexTickerLast(market, tickers) {
  let url = ''

  const query = tickers.join(',')

  if (market === 'TQBR') {
    url = `https://iss.moex.com/iss/engines/stock/markets/shares/boards/${market}/securities.json?securities=${query}`
  } else {
    url = `https://iss.moex.com/iss/engines/stock/markets/bonds/boards/${market}/securities.json?securities=${query}`
  }

  const json = await fetch(url)
      .then((res) => {
        return res.json()
      });

  const fMarketdata = moexFilter(json.marketdata.data, market)
  const fSecurities = moexFilter(json.securities.data, market)

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
    moexlist: fSecurities,
    moexAll: fMarketdata
  }
}
export async function moexBondId(market, tickers) {
  const query = tickers.join(',')
  const json = await fetch(`https://iss.moex.com/iss/engines/stock/markets/bonds/boards/${market}/securities.json?securities=${query}`)
      .then((res) => {
        return res.json()
      });

  return json.securities.data
}

// TQOB
export async function moexBonds(market, tickers) {
  const json = await fetch(`https://iss.moex.com/iss/engines/stock/markets/bonds/boards/${market}/securities.json`)
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

  const items = moexBondsTransformer(fMarketdata, fSecurities, indexes)
  return {
    items,
    moexlist: fSecurities,
    moexAll: fMarketdata
  }
}

function moexFilter(data, market) {
  if (market === 'TQBR') {
    return data.filter(function(d) {
      return ['TQBR', 'TQTF'].indexOf(d[1]) !== -1;
    })
  } else {
    return data
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
        })
  })

  return result
}
