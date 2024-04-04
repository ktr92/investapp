import {Position} from './position/Position';

export class Portfolio {
  constructor(public id: string, public name: string, public depo: number, public positions: Array<Position> = [], public comm: number) {}

  buyStock(position: Position) {
    this.positions.push(position)
  }
}
