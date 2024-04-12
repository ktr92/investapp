export function mapMarket(marketData = [], securityData = []) {
  let isData = false
  if (marketData.length && securityData.length) {
    isData = true
  }
  return {
    'TQBR': {
      type: 'stock',
      market: 'TQBR',
      priceIndex_1: 2,
      priceIndex_2: 36,
      nominalIndex: 23,
      currencyIndex: 16,
      data: isData ? {
        ticker: marketData[0],
        name: securityData[2],
        fullname: securityData[9],
        engname: securityData[20],
        price: marketData[2] ? marketData[2] : marketData[36],
        startPrice: marketData[9],
        currency: securityData[16],
        nominal: 1
      } : {}
    },
    'TQCB': {
      type: 'bonds',
      market: 'TQCB',
      priceIndex_1: 3,
      priceIndex_2: 1,
      nominalIndex: 38,
      currencyIndex: 25,
      data: isData ?
        {
          ticker: marketData[0],
          name: securityData[2],
          fullname: securityData[19],
          engname: securityData[29],
          price: marketData[3] ?? marketData[11],
          startPrice: marketData[8],
          currency: securityData[25],
          nominal: securityData[38],
        } : {}

    },
    'TQOB': {
      type: 'bonds',
      market: 'TQOB',
      priceIndex_1: 3,
      priceIndex_2: 1,
      nominalIndex: 38,
      currencyIndex: 25,
      data: isData ? {
        ticker: marketData[0],
        name: securityData[2],
        fullname: securityData[19],
        engname: securityData[29],
        price: marketData[3],
        startPrice: marketData[8],
        currency: securityData[25],
        nominal: securityData[38],
      } : {}
    },
  }
}
