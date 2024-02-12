import {Position} from './position/Position';

export class Portfolio {
  constructor(public name: string, public positions: Array<Position> = []) {}

  buyStock(position: Position) {
    this.positions.push(position)
  }
}
