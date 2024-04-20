// слайдеры
let slider = document.getElementById("range");
let output = document.getElementById("value");
output.innerHTML = slider.value;
slider.oninput = function() {
    output.innerHTML = this.value;
}

let size = document.getElementById("size");
let sizeOutput = document.getElementById("sizeValue");
sizeOutput  .innerHTML = size.value;
size.oninput = function() {
    sizeOutput.innerHTML = this.value;
    draw();
}

function draw() {
    let maze = document.getElementById("maze");
    maze.innerHTML = '';

    let gridSize = size.value;
    let cellSize = Math.floor(500 / gridSize);
    let template = 'repeat(' + gridSize + ', ' + cellSize + 'px)';

    maze.style.gridTemplateRows = template;
    maze.style.gridTemplateColumns = template;

    for (let i = 0; i < size.value; i++) {
        for (let j = 0; j < size.value; j++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.style.width = cellSize + 'px';
            cell.style.height = cellSize + 'px';

            cell.addEventListener("click", function () {
                if (!cell.classList.contains('start') && !cell.classList.contains('end')) {
                    cell.classList.toggle("wall");
                }
            });

            maze.appendChild(cell);
        }
    }
}
draw();


function lock(){
    document.getElementById('start').disabled = true;
    document.getElementById('auto').disabled = true;
    document.getElementById('delete').disabled = true;
    document.getElementById('add').disabled = true;
    document.getElementById('size').disabled = true;

}
function unlock(){
    document.getElementById('start').disabled = false;
    document.getElementById('auto').disabled = false;
    document.getElementById('delete').disabled = false;
    document.getElementById('add').disabled = false;
    document.getElementById('size').disabled = false;

}

// очистка лабиринта
function clearMaze() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('wall');
        cell.classList.remove('start');
        cell.classList.remove('end');
        cell.classList.remove('spotted');
        cell.classList.remove('visited');
        cell.classList.remove('path');
    });
}

// удаления старта и финиша
function clearPos() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('start');
        cell.classList.remove('end');
        cell.classList.remove('spotted');
        cell.classList.remove('visited');
        cell.classList.remove('path');
    });
}

// добавление старта и финиша
function addPos() {
    lock();
    let startCell = null;
    let finishCell = null;

    clearPos();
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('click', function () {
            if (!startCell) {
                startCell = cell;
                cell.classList.add('start');
                cell.classList.remove('wall');
            } else if (!finishCell) {
                finishCell = cell;
                cell.classList.add('end');
                cell.classList.remove('wall');
                unlock();
            }
        });
    });
}

export {lock,unlock,clearMaze,slider,size};
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('add').addEventListener('click', addPos);
    document.getElementById('delete').addEventListener('click', clearMaze);
});