export function mapMarket(): IMoexObject {
  return {
    'TQBR': {
      type: 'stock',
      market: 'TQBR',
      priceIndex_1: 2,
      priceIndex_2: 3,
      nominalIndex: -1,
      currencyIndex: 16,
      tickerIndex: 0,
      nameIndex: 2,
      fnameIndex: 9,
      engnameIndex: 20,
      openPriceIndex: 9,
      nkdIndex: null,
    /*   data: isData ? {
        ticker: marketData[0],
        name: securityData[2],
        fullname: securityData[9],
        engname: securityData[20],
        price: marketData[2] ? marketData[2] : marketData[12],
        startPrice: marketData[9],
        currency: securityData[16],
        nominal: 1
      } : {} */
    },
    'TQCB': {
      type: 'bonds',
      market: 'TQCB',
      priceIndex_1: 3,
      priceIndex_2: 8,
      nominalIndex: 38,
      currencyIndex: 25,
      tickerIndex: 0,
      nameIndex: 2,
      fnameIndex: 19,
      engnameIndex: 29,
      openPriceIndex: 8,
      nkdIndex: 7,
      /* data: isData ?
        {
          ticker: marketData[0],
          name: securityData[2],
          fullname: securityData[19],
          engname: securityData[29],
          price: marketData[3] ?? marketData[11],
          startPrice: marketData[8],
          currency: securityData[25],
          nominal: securityData[38],
        } : {} */

    },
    'TQOB': {
      type: 'bonds',
      market: 'TQOB',
      priceIndex_1: 3,
      priceIndex_2: 8,
      nominalIndex: 38,
      currencyIndex: 25,
      tickerIndex: 0,
      nameIndex: 2,
      fnameIndex: 19,
      engnameIndex: 29,
      openPriceIndex: 8,
      nkdIndex: 7,
    /*   data: isData ? {
        ticker: marketData[0],
        name: securityData[2],
        fullname: securityData[19],
        engname: securityData[29],
        price: marketData[3],
        startPrice: marketData[8],
        currency: securityData[25],
        nominal: securityData[38],
      } : {} */
    },
  }
}
