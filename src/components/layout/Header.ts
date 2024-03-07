import {DomComponent} from '../DomComponent';

export class Header extends DomComponent implements IObjIndexable {
  constructor(selector: string) {
    super(selector)
    this.initListeners('click')
  }

  changeTheme() {
    const html = this.$('html')
    if (html instanceof Element) {
      this.toggleClass(html, 'dark')
    }
  }
}
