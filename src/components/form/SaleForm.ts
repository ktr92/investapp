import {Form} from './Form';
import {Store} from '../../store'

interface IModalData {
  id: string,
  ptf: string,
  market: string
}

export class SaleForm extends Form {
  constructor(selector: string, public state: Store, public mode: string, public onSubmit?: (id: string, position: IPosition, isclone?: boolean, market?: string) => void, public modaldata?: IModalData) {
    super(selector, state, onSubmit)
  }
}
