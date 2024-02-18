import {ViewComponent} from './ViewComponent'

export class TableComponent implements IObjIndexable {
  constructor() {
    this.props = []
  }
  [index: string]: unknown

  components: Array<TableComponent>
  props: Array<ViewComponent>
}
