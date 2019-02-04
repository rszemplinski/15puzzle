type MouseDownEvent = (e: MouseEvent, tile: Tile) => void;
type MouseUpEvent = (e: MouseEvent, tile: Tile, start: XYCoords) => void;

class Tile {
    public container: HTMLElement;

    constructor(
        public number: number,
        public size: number,
        public coords: XYCoords,
        parentContainer: HTMLElement,
        private mouseDown: MouseDownEvent,
        private mouseUp: MouseUpEvent
    ) {
        this.container = document.createElement("div");
        this.container.className = "puzzle-tile";
        this.container.style.width = `${size}px`;
        this.container.style.height = `${size}px`;
        this.container.innerHTML = `<span>${number}</span>`;

        this.setPosition(coords);
        parentContainer.appendChild(this.container);
        this.container.addEventListener("mousedown", this.handleMouseDown);
    }

    private mouseUpFunc: (e: MouseEvent) => void;

    private handleMouseDown = (e: MouseEvent) => {
        const startX = e.clientX;
        const startY = e.clientY;
        this.mouseUpFunc = (e: MouseEvent) => {
            this.handleMouseUp(e, [startX, startY]);
        };
        document.addEventListener("mouseup", this.mouseUpFunc);
        this.mouseDown(e, this);
    };

    private handleMouseUp = (e: MouseEvent, start: XYCoords) => {
        this.mouseUp(e, this, start);
        document.removeEventListener("mouseup", this.mouseUpFunc);
    };

    public setPosition(coords: XYCoords) {
        this.container.style.left = `${coords[0] * this.size}`;
        this.container.style.top = `${coords[1] * this.size}`;
        this.coords = coords;
    }

    public destroy() {
        this.container.removeEventListener("mousedown", this.handleMouseDown);
    }
}

export default Tile;
