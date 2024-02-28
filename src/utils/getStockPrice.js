export async function moexTickerLast(tickers) {
  const json = await fetch('https://iss.moex.com/iss/engines/stock/markets/shares/boards/TQBR/securities.json?q=GAZP,SBER')
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

  return moexTransformer(fMarketdata, fSecurities, indexes)
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
          price: market[index][12],
          open: security[index][3],
        })
  })

  return result
}
