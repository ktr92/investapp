import './scss/tw.scss';
import './scss/index.scss'

import {Header} from './components/layout/Header';
import {App} from './components/App';
import {Modal} from './components/UI/Modal';
import {BlockTable} from './components/table/Blocktable';
import {Store} from './store';

const state = new Store;
(async function() {
  state.moex = await state.actions.initMoex()
  state.currency = await state.actions.initCurrency()
  const app = new App('#app', {
    components: [Header, BlockTable, Modal],
    state: state
  });
  app.render();
})();
