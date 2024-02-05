async function moexTickerLast(ticker) {
  const json = await fetch('https://iss.moex.com/iss/engines/stock/markets/shares/securities/' + ticker + '.json?iss.meta=off')
      .then((res) => {
        return res.json()
      });
  return json.marketdata.data.filter(function(d) {
    return ['TQBR', 'TQTF'].indexOf(d[1]) !== -1;
  })[0][12];
}

moexTickerLast('GAZP').then(console.log);
