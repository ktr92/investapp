import './scss/tw.scss';
import './scss/index.scss'

import {Header} from './components/layout/Header';
import {App} from './components/App';
import {Modal} from './components/UI/Modal';
import {BlockTable} from './components/table/Blocktable';
import {Store} from './store';

const state = new Store;
/*
const socket = new WebSocket('wss://invest-public-api.tinkoff.ru/ws/');
socket.onopen = function(e) {
  console.log('connected')
};

const tickers = state.getters.getAllTickers('TQBR');
console.log(tickers['TQBR']); */

(async function() {
  state.moex = await state.actions.initMoex()
  state.currency = await state.actions.initCurrency()
  const app = new App('#app', {
    components: [Header, BlockTable, Modal],
    state: state
  });
  app.render();
})();
