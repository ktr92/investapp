
interface IState {
  moex: Array<IMoexApi>
  portfolio: Array<IPortfolio>
  currentPortfolio?: IPortfolio[]
}

const state: IState = {
  moex: [],
  portfolio: [
    {
      id: '1',
      name: 'Среднесрочный портфель',
      depo: 450000,
      comm: 0.09,
      defaultSumm: 50000,
      defaultCategory: 'TQBR',
      markets: {
        TQBR: [
          {
            positionId: '1',
            portfolioId: '1',
            ticker: 'HYDR',
            type: 'stock',
            market: 'TQBR',
            buyPrice: 0.267,
            count: 416000,
            myStop: 0,
          },
        ],
        TQCB: [],
        TQOB: [],
      },
    },
    {
      id: '2',
      name: 'Долгосрочный портфель',
      depo: 200000,
      comm: 0.09,
      defaultSumm: 50000,
      defaultCategory: 'TQBR',
      markets: {
        TQBR: [
          {
            positionId: '2',
            portfolioId: '2',
            ticker: 'ASTR',
            type: 'stock',
            market: 'TQCB',

            buyPrice: 210,
            count: 178,
          },
          {
            positionId: '3',
            portfolioId: '2',
            ticker: 'SNGSP',
            type: 'stock',
            market: 'TQCB',

            buyPrice: 22,
            count: 1000,
            myStop: 0,
          },
        ],
        TQCB: [],
        TQOB: [],
      },
    },
    {
      id: '3',
      name: 'Портфель облигаций',
      depo: 500000,
      comm: 0.095,
      defaultSumm: 50000,
      defaultCategory: 'TQBR',
      markets: {
        TQBR: [],
        TQCB: [
          {
            positionId: '6',
            portfolioId: '3',
            ticker: 'RU000A105A95',
            type: 'bonds',
            market: 'TQCB',
            nkd: 10,
            buyPrice: 40,
            count: 1,
            nominal: 1000,
            currency: 'USD',
            buyCurrency: 90,
          },
          {
            positionId: '7',
            portfolioId: '3',
            ticker: 'RU000A107B43',
            type: 'bonds',
            market: 'TQCB',
            nkd: 13,
            buyPrice: 54,
            count: 2,
            nominal: 1000,
            currency: 'USD',
            buyCurrency: 92,
          },
          {
            positionId: '8',
            portfolioId: '3',
            ticker: 'RU000A107B43',
            type: 'bonds',
            nkd: 11,
            market: 'TQCB',
            buyPrice: 64,
            count: 1,
            nominal: 1000,
            currency: 'USD',
            buyCurrency: 88,
          },
        ],
        TQOB: [
          {
            positionId: '9',
            portfolioId: '3',
            ticker: 'SU26238RMFS4',
            type: 'bonds',
            market: 'TQOB',
            buyPrice: 45,
            count: 50,
            nominal: 1000,
            currency: '',
            nkd: 7,
          },
        ],
      },
    },
  ],
}

export default state
