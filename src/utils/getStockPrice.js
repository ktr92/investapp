export async function moexTickerLast(tickers) {
  const json = await fetch('https://iss.moex.com/iss/engines/stock/markets/shares/boards/TQBR/securities.json?q=GAZP,SBER')
      .then((res) => {
        return res.json()
      });
  const fMarketdata = json.marketdata.data.filter(function(d) {
    return ['TQBR', 'TQTF'].indexOf(d[1]) !== -1;
  })
  const fSecurities = json.securities.data.filter(function(d) {
    return ['TQBR', 'TQTF'].indexOf(d[1]) !== -1;
  })

  const resMarketdata = []
  const resSecurities = []

  fMarketdata.forEach(element => {
    if (tickers.indexOf(element[0]) > -1) {
      resMarketdata.push(element)
    }
  });
  fSecurities.forEach(element => {
    if (tickers.indexOf(element[0]) > -1) {
      resSecurities.push(element)
    }
  });

  return [
    resMarketdata,
    resSecurities
  ]
}
