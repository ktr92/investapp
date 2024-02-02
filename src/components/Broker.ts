import {Portfolio} from './Portfolio';

export class Broker {
  constructor(
    public name: string,
    public tfee: number,
    public portfolio: Portfolio
  ) {}
}
