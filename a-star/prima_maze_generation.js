import {lock,unlock,clearMaze,slider,size,} from './maze.js';
class Point {
    constructor(row, column, point) {
        this.row = row;
        this.column = column;
        this.clear = false;
        this.parent = point;
    }
    opposite() {
        let dx = this.row - this.parent.row;
        let dy = this.column - this.parent.column;

        let oppositeX = this.row + dx;
        let oppositeY = this.column + dy;

        return new Point(oppositeX, oppositeY, this);
    }

    isWall() {
        return !this.clear;
    }

    makeClear() {
        cells[this.row * (mazeSize - add) + this.column].classList.remove('wall');
        this.clear = true;
    }

    makeWall() {
        cells[this.row * (mazeSize - add) + this.column].classList.add('wall');
        this.clear = false;
    }
}

function isSafe(row,column){
    return (row>=0 && row < mazeSize && column >=0 && column < mazeSize);
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function prima() {
    cells = document.querySelectorAll('.cell');
    mazeSize = size.value;
    add = 0;
    if (mazeSize % 2 === 0){mazeSize ++; add = 1;}

    // генерация поля
    clearMaze();
    let maze = [];
    for (let i = 0; i < mazeSize - add; i++) {
        maze[i] = [];

        for (let j = 0; j < mazeSize - add; j++) {
            maze[i][j] = new Point(i, j, null);
            maze[i][j].makeWall(i, j);
        }
    }

    let currentPoint = new Point(0, 0, null);
    cells[currentPoint.row * (mazeSize - add) + currentPoint.column].classList.add('start');
    maze[currentPoint.row][currentPoint.column].makeClear();
    lock();

    let queue = [];
    let visited = [];
    for (let i = 0;i<mazeSize;i++){
        visited[i] = [];
        for (let j = 0;j<mazeSize;j++){
            visited[i][j] = 0;
        }
    }

    // добавляем наследников стартовой точки в очередь
    for (let x = -1; x <= 1; x++){
        for (let y = -1; y <= 1; y++){
            if (x === 0 && y === 0 || x !== 0 && y !== 0){
                continue;
            }
            if (isSafe(currentPoint.row + x,currentPoint.column + y)){
                if (maze[currentPoint.row + x][currentPoint.column + y].isWall()) {
                    queue.push(new Point(currentPoint.row + x, currentPoint.column + y, currentPoint));
                }
            }
        }
    }
    function visualizePrima() {
        if (queue.length === 0 ){
            cells[currentPoint.row * (mazeSize - add) + currentPoint.column].classList.add('end');
            maze[currentPoint.row][currentPoint.column].makeClear();
            unlock();
            return;
        }
        // обработка наследников
        if (queue.length > 0) {
            let index = random(0, queue.length)
            currentPoint = queue[index];
            let op = currentPoint.opposite();
            visited[queue[index].row][queue[index].column]=1;
            queue.splice(index, 1);

            if (maze[currentPoint.row][currentPoint.column].isWall() && isSafe(op.row,op.column)){
                if (add === 0 || add === 1 && op.row < mazeSize - 1 && op.column < mazeSize -1) {
                    if (maze[op.row][op.column].isWall()) {
                        maze[currentPoint.row][currentPoint.column].makeClear();
                        maze[op.row][op.column].makeClear();
                    }
                }
                else {
                    maze[currentPoint.row][currentPoint.column].makeClear();
                }
            }

            // добавляем наследников противоположной точки
            for (let x = -1; x <= 1; x++){
                for (let y = -1; y <= 1; y++){
                    if (x === 0 && y === 0 || x !== 0 && y !== 0){
                        continue;
                    }
                    if (isSafe(op.row + x,op.column + y)){
                        if (add === 0 || add === 1 && op.row + x < mazeSize - 1 && op.column + y < mazeSize - 1) {
                            if (maze[op.row + x][op.column + y].isWall() && visited[op.row + x][op.column + y] === 0) {
                                queue.push(new Point(op.row + x, op.column + y, op));
                            }
                        }
                    }
                }
            }

        }
        setTimeout(visualizePrima, 100 - slider.value);
    }
    visualizePrima();
    clearInterval(visualizePrima);
}

let add = 0;
let mazeSize = size.value;
let cells = document.querySelectorAll('.cell');
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('auto').addEventListener('click', prima);
});
