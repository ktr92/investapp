import {ViewComponent} from './ViewComponent'

export class TableComponent {
  constructor() {
    this.props = []
  }
  components: Array<TableComponent>
  props: Array<ViewComponent>
}
