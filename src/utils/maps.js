export function mapMarket(marketData, securityData) {
  return {
    'TQBR': {
      type: 'stock',
      data: {
        ticker: marketData[0],
        name: securityData[2],
        fullname: securityData[9],
        engname: securityData[20],
        price: marketData[2] ? marketData[2] : marketData[36],
        startPrice: marketData[9],
        currency: securityData[16],
        nominal: 1
      }
    },
    'TQCB': {
      type: 'bonds',
      data:
        {
          ticker: marketData[0],
          name: securityData[2],
          fullname: securityData[19],
          engname: securityData[29],
          price: marketData[3] ?? marketData[11],
          startPrice: marketData[8],
          currency: securityData[25],
          nominal: securityData[38],
        }

    },
    'TQOB': {
      type: 'bonds'
    },
  }
}
