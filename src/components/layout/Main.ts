import {DomComponent} from '../DomComponent';

export class Main extends DomComponent {
  constructor(selector: string) {
    super(selector)
    this.initListeners('click')
  }
}
