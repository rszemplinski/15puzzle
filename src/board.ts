import Tile from "./tile";
import { flatten } from "./helpers";

type Direction = 1 | -1;

class Board {
    tiles: Array<Array<Tile>> = [];
    private rowSize: number = 4;

    constructor(private size: number = 500, private container: HTMLElement) {
        container.style.width = `${size}px`;
        container.style.height = `${size}px`;
    }

    public generateTiles() {
        this.clearBoard();

        let sequentialNumbers = [];
        for (let i = 1; i <= 15; i++) {
            sequentialNumbers.push(i);
        }

        for (let x = 0; x < this.rowSize; x++) {
            let tiles = [];
            for (let y = 0; y < this.rowSize; y++) {
                const randomNumber = sequentialNumbers.splice(
                    Math.floor(Math.random() * sequentialNumbers.length),
                    1
                );

                if (randomNumber.length === 0) {
                    tiles.push(undefined);
                    break;
                }

                const tile = new Tile(
                    randomNumber[0],
                    this.size / this.rowSize,
                    [x, y],
                    this.container,
                    this.handleMouseDown,
                    this.handleMouseUp
                );
                tiles.push(tile);
            }
            this.tiles.push(tiles);
        }
        console.log(this.tiles);
    }

    private handleMouseDown = (e: MouseEvent, tile: Tile) => {};

    private handleMouseUp = (e: MouseEvent, tile: Tile, start: XYCoords) => {
        const [startX, startY] = start;
        const endX = e.clientX;
        const endY = e.clientY;
        const diffX = endX - startX;
        const diffY = endY - startY;

        if (diffX === 0 && diffY === 0) return;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            this.moveTile(tile, true, Math.sign(diffX) as Direction);
        } else {
            this.moveTile(tile, false, Math.sign(diffY) as Direction);
        }
    };

    private moveTile = (tile: Tile, xDir: boolean, direction: Direction) => {
        let [iX, iY] = tile.coords;
        const tiles = this.canMove(iX, iY, xDir, direction);
        if (tiles.length > 0) {
            tiles.forEach(t => {
                const [x, y] = t.coords;
                if (xDir) {
                    t.setPosition([x + direction, y]);
                    this.tiles[x + direction][y] = t;
                } else {
                    t.setPosition([x, y + direction]);
                    this.tiles[x][y + direction] = t;
                }
            });
            this.tiles[iX][iY] = undefined;
        }
    };

    private withinBounds = (x: number, y: number): boolean => {
        return x >= 0 && x < this.rowSize && y >= 0 && y < this.rowSize;
    };

    private canMove = (
        x: number,
        y: number,
        xDir: boolean,
        direction: Direction
    ): Array<Tile> => {
        let tiles = [];
        if (xDir) {
            let cX = x;
            let tile = this.tiles[cX][y];
            tiles.push(tile);
            while (this.withinBounds(cX + direction, y) && tile !== undefined) {
                cX += direction;
                tile = this.tiles[cX][y];
                if (tile === undefined) {
                    return tiles;
                } else {
                    tiles.push(tile);
                }
            }
        } else {
            let cY = y;
            let tile = this.tiles[x][cY];
            tiles.push(tile);
            while (this.withinBounds(x, cY + direction) && tile !== undefined) {
                cY += direction;
                tile = this.tiles[x][cY];
                if (tile === undefined) {
                    return tiles;
                } else {
                    tiles.push(tile);
                }
            }
        }

        return [];
    };

    public clearBoard() {
        flatten(this.tiles).forEach(x => x.destroy());
        this.tiles = [];

        // This was proven to be those most performant way of clearing all the elements
        // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
        // https://jsperf.com/innerhtml-vs-removechild/15
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
    }
}

export default Board;
