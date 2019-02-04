import Board from "./board";

const container = document.getElementById("puzzle-container"),
    boardSize = 500;

const board = new Board(boardSize, container);
board.generateTiles();
