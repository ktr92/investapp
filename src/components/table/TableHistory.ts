import {DomComponent} from '../DomComponent';

export class TableHistory extends DomComponent {
  constructor(public selector: string) {
    super(selector)
  }

  render() {
    const $root: HTMLElement = document.querySelector(this.selector)
    $root.insertAdjacentHTML('beforeend', '<div class="history"></div>')
  }
}
