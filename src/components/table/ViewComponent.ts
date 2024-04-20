import {Store} from '../../store'
import {Emitter} from '../Emitter'

export class ViewComponent {
  constructor(public options: Store) {}
  sort: number
  sortField: number
  render() {
    return ''
  }
  initListeners(emitter?: Emitter): void {
    return void 0
  }
}
