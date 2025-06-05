import './scss/tw.scss';
import './scss/index.scss'

import {Header} from './components/layout/Header';
import {App} from './components/App';
import {Modal} from './components/UI/Modal';
import {BlockTable} from './components/table/Blocktable';
import {Store} from './store/moex';

/** Create a state used throughout the app */
const state = new Store;

(async function() {
  /** Load exchange data and save it to use throughout the app */

  state.moex = await state.actions.initMoex()
  localStorage.setItem('moexdata', JSON.stringify(state.moex))

  state.currency = await state.actions.initCurrency()

  /** Create an instance of the app - the root component with the state and its components */
  const app = new App('#app', {
    components: [Header, BlockTable, Modal],
    state: state
  });
  app.render();
})();
