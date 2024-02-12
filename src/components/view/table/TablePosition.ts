import {TableComponent} from './TableComponent';
import {ViewComponent} from '../ViewComponent';
import {TableStock} from '../TableStock';
import {Change} from '../../position/Change';
import {Count} from '../../position/Count';
import {Price} from '../../position/Price';
import {Stock} from '../../position/Stock';
import {Totalprice} from '../../position/Totalprice';
import {TableChange} from '../TableChange';
import {TableCount} from '../TableCount';
import {TablePrice} from '../TablePrice';
import {TableTotal} from '../TableTotal';

export class TablePosition extends ViewComponent {
  constructor(public items: Array<TableComponent>) {
    super()
  }

  public stock: TableStock;
  public count: TableCount;
  public buyPrice: TablePrice;
  public buyTotal: TableTotal;
  public changeTotal: TableChange;
  public changeDaily: TableChange

  fill() {
    const cells: Array<TableComponent> = []
    const el: TableComponent = null

    this.stock = new TableStock(this.items.s)

    const tableStock = new TableStock(value, 1)
    const tableStartprice = new TableStock(value)
    const tableStock = new TableStock(value)
    const tableStock = new TableStock(value)
    const tableStock = new TableStock(value)
    const tableStock = new TableStock(value)

    cells.push(el)

    return cells
  }
}
