export class SquareId {
    constructor(squareId) {
        let squareIdArray = squareId.split('_');
        this.row = squareIdArray[1];
        this.column = squareIdArray[2];
    }

    toString() {
        return `Row: ${this.row} column: ${this.column}`;
    }
}