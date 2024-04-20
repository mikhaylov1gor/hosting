import {map,pheromones,reset} from './ant_algorithm_pro.js'

const canvas = document.getElementById('field');
let ctx = canvas.getContext('2d');

function startDrawing(e){
    isDrawing = true;
    draw(e);
}

function endDrawing(){
    isDrawing = false;
}


function draw(e){
    if (isDrawing) {
        let x = e.offsetX, y = e.offsetY;
        if (drawingColony && colonyPos.length < 2) {
            if (colonyPos.length === 0 || colonyPos.length === 1 && (Math.abs(x-colonyPos[0].x) > 100 || Math.abs(y-colonyPos[0].y) > 100)) {
                colonyPos.push({x: x, y: y, color: colonyPos.length});
                drawColony();
            }
        }

        if (drawingWalls) {
            drawWall(x, y);
            for (let i = x;i<x+35;i++){
                for (let j = y;j<y+35;j++){
                    map[i][j]=-1;
                }
            }
            for (let i =  x - 10;i<x+45;i++){
                for (let j = y - 10;j<y+45;j++){
                    pheromones[i][j].food = 0;
                    pheromones[i][j].home = 0;
                }
            }
            walls.push({x:x,y:y});
        }

        if (drawingFood) {
            drawFood(x, y);
            for (let i = x;i<x+20;i++){
                for (let j = y;j<y+20;j++){
                    map[i][j]=-2;
                }
            }
            food.push({x:x,y:y});
        }
    }
}

function drawColony(){
    for (let i = 0; i < colonyPos.length;i++) {
        ctx.beginPath();
        ctx.arc(colonyPos[i].x, colonyPos[i].y, 15, 0, Math.PI * 2);
        if (i === 0) {
            ctx.fillStyle = "red";
        } else {ctx.fillStyle = 'white';}
        ctx.fill();
        ctx.closePath();
    }
}
function drawWall(x,y){
    ctx.beginPath();
    ctx.rect(x, y, 35, 35);
    ctx.fillStyle = 'navajowhite';
    ctx.fill();
    ctx.closePath();
}
function drawFood(x,y) {
    ctx.beginPath();
    ctx.rect(x - 10, y - 10, 20, 20);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.closePath();
}

function switchColony(){
    drawingColony = true;
    drawingWalls = false;
    drawingFood = false;

    document.getElementById('addWall').disabled = false;
    document.getElementById('addColony').disabled = true;
    document.getElementById('addFood').disabled = false;
}

function switchWalls(){
    drawingWalls = true;
    drawingColony = false;
    drawingFood = false;

    document.getElementById('addWall').disabled = true;
    document.getElementById('addColony').disabled = false;
    document.getElementById('addFood').disabled = false;
}

function switchFood(){
    drawingFood = true;
    drawingWalls = false;
    drawingColony = false;

    document.getElementById('addWall').disabled = false;
    document.getElementById('addColony').disabled = false;
    document.getElementById('addFood').disabled = true;
}

function drawMap(ants) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < ants.length; i++) {
        for (let j = 0; j < ants[i].pheromonePath.length; j++) {
            const x = ants[i].pheromonePath[j].x;
            const y = ants[i].pheromonePath[j].y;
            if (pheromones[x][y].food > 0.001){
                if (ants[i].nation === 0) {
                    ctx.fillStyle = 'lawngreen';
                } else {ctx.fillStyle = 'lightgray';}
                ctx.fillRect(x, y, 1, 1);
                pheromones[x][y].food -= 0.05;
            }
            else if (pheromones[x][y].home > 0.001 ) {
                if (ants[i].nation === 0) {
                    ctx.fillStyle = 'mediumpurple';
                } else {ctx.fillStyle = 'red';}
                ctx.fillRect(x, y, 1, 1);
                pheromones[x][y].home -= 0.05;
            }
            else {
                ants[i].pheromonePath.splice(j,1);
                pheromones[x][y].food = 0; pheromones[x][y].home = 0; pheromones[x][y].family = 0;
            }
        }
        if (ants[i].nation === 0) {
            ctx.drawImage(antImage, ants[i].x - 5, ants[i].y - 5, 10, 10);
        } else {
            ctx.drawImage(anotherAntImage, ants[i].x - 5, ants[i].y - 10, 10, 10);
        }
    }

    if (ants.length === 0){
        alert('Муравьи вымерли :)');
    }
    if (colonyPos.length > 0){ drawColony();}
    for (let i = 0; i < food.length; i++) drawFood(food[i].x, food[i].y);
    for (let i = 0; i < walls.length; i++) drawWall(walls[i].x, walls[i].y);
}

function info(){
    alert ("Муравьиный алгоритм поиска кратчайшего пути.\n\nУлучшения: \nМуравьи-разведчики \nПоддержка двух колоний");
}
function clear(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    colonyPos = [];
    reset();
    walls=[];
    food=[];
    for (let i = 0 ;i<750;i++){
        map[i]=[];
    }
}

//слайдеры
let antCount = document.getElementById("ants");
let outputCount = document.getElementById("antsCount");
outputCount.innerHTML = antCount.value;
antCount.oninput = function() {
    outputCount.innerHTML = this.value;
}

let slider = document.getElementById("range");
let output = document.getElementById("value");
output.innerHTML = slider.value;
slider.oninput = function() {
    output.innerHTML = this.value;
}


let colonyPos =[];
let walls = [];
let food = [];

let drawingColony = false;
let drawingWalls = false;
let drawingFood = false;
let isDrawing = false;
let antImage = new Image();
let anotherAntImage = new Image ();
antImage.src = '../../source/ant_algorithm_images/ant.png';
anotherAntImage.src = '../../source/ant_algorithm_images/anotherAnt.png';

export {slider,antCount,colonyPos,drawMap,ctx};
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addColony').addEventListener('click', switchColony);
    document.getElementById('addWall').addEventListener('click', switchWalls);
    document.getElementById('addFood').addEventListener('click', switchFood);
    document.getElementById('delete').addEventListener('click', clear);
    document.getElementById('info').addEventListener('click', info);

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
   canvas.addEventListener('mouseup', endDrawing);
});

