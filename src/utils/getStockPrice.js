export async function moexTickerLast(tickers) {
  const json = await fetch('https://iss.moex.com/iss/engines/stock/markets/shares/boards/TQBR/securities.json')
      .then((res) => {
        return res.json()
      });

  const fMarketdata = moexFilter(json.marketdata.data)
  const fSecurities = moexFilter(json.securities.data)
  const indexes = []

  fMarketdata.forEach((element, index) => {
    if (tickers.indexOf(element[0]) > -1) {
      indexes.push(index)
    }
  });

  const items = moexTransformer(fMarketdata, fSecurities, indexes)
  return {
    items,
    moexlist: fSecurities,
    moexAll: fMarketdata
  }
}
export async function moexBondId(tickers) {
  const query = tickers.join(',')
  const json = await fetch(`https://iss.moex.com/iss/engines/stock/markets/bonds/boards/TQCB/securities.json?securities=${query}`)
      .then((res) => {
        return res.json()
      });

  return json.securities.data
}
export async function moexBonds(tickers) {
  const json = await fetch('https://iss.moex.com/iss/engines/stock/markets/bonds/boards/TQCB/securities.json')
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

function moexFilter(data) {
  return data.filter(function(d) {
    return ['TQBR', 'TQTF'].indexOf(d[1]) !== -1;
  })
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
