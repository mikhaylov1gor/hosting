import { geneticAlgorithm } from "./genetic.js";
import { timeout,showShortestDistance } from "./settings.js";

export let points = [];
export let searchingRoute = false;

let shortestRoute = [];
let population = [];
let interval = null;
let showLines = true;
let answerIsFound= false;
let pointRemovalMode = false;

const canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d');
canvas.addEventListener('click', function (event){
    let edge  = canvas.getBoundingClientRect();
    let x = event.clientX - edge.left;
    let y = event.clientY - edge.top;
    let point = {x: x, y: y}

    if (pointRemovalMode){
        deletePoint(point);
        return;
    }

    if(points.length > 49){
        alert('Я не буду запускаться с таким большим количеством точек');
        return;
    }

    if (!checkOverlay(point)){
        alert('Не ставьте точки друг на друга!!!');
        return;
    }
    showShortestDistance(null);
    resetInterval();
    shortestRoute.length = 0;
    population.length = 0;
    answerIsFound = false;
    searchingRoute = false;
    points.push(point);
    redrawGraph();
});

function deletePoint(point){
    if (findNearestPoint(point)){
        showShortestDistance(null);
        resetInterval();
        shortestRoute.length = 0;
        population.length = 0;
        answerIsFound = false;
        searchingRoute = false;
        redrawGraph();
    }
}

const deletePointButton = document.getElementById('delete-point');
deletePointButton.addEventListener('click',function (){
    pointRemovalMode = !pointRemovalMode;
    if (pointRemovalMode){
        document.getElementById('delete-img').src ="../source/genetic_icons/delete-point-active.png"
    } else {
        document.getElementById('delete-img').src="../source/genetic_icons/delete-point-inactive.png"
    }
});

function findNearestPoint(point){
    for (let i = 0; i < points.length; i++){
        if (calculateDistance(point,points[i]) < 11.5){
            points.splice(i, 1);
            return true;
        }
    }
    return false;
}

function calculateDistance(pointFirst, pointSecond){
    return Math.sqrt((pointFirst.x - pointSecond.x)**2 + (pointFirst.y - pointSecond.y)**2);
}

function checkOverlay(point){
    for (let i = 0; i < points.length; i++){
        if (calculateDistance(point, points[i]) < 18){
            return false;
        }
    }
    return true;
}

const findButton = document.getElementById('start');
findButton.addEventListener('click', function (){
    resetInterval();
    if (points.length < 3){
        alert('Поставьте больше точек...')
        return;
    }
    population.length = 0;
    findRoute();
});

export function findRoute(){
    searchingRoute = true;
    answerIsFound = false;
    let countIterations = 0;
    interval = setInterval(function (){
        population = geneticAlgorithm(population)
        if (population[0] !== shortestRoute){
            shortestRoute = population[0];
            redrawGraph();
            countIterations = 0;
        }
        if (countIterations > 100){
            searchingRoute = false;
            answerIsFound = true;
            resetInterval();
            redrawGraph();
        }
        countIterations++;
    }, timeout);
}

const clearCanvasButton = document.getElementById('clear-canvas');
clearCanvasButton.addEventListener('click', function (){
    showShortestDistance(null);
    resetInterval();
    ctx.reset();
    points.length = 0;
    shortestRoute.length = 0;
    population.length = 0;
    answerIsFound = false;
    searchingRoute = false;
});

const showLinesButton = document.getElementById('show-lines');
showLinesButton.addEventListener('click', function (){
    showLines = !showLines;
    redrawGraph();
    if (searchingRoute) {
        resetInterval();
        findRoute();
    }
});

function drawPoints(){
    ctx.font = "15px Arial";
    ctx.textAlign = "center";
    let len = points.length;
    for (let i = 0; i < len; i++){
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.arc(points[i].x, points[i].y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.fillText(i + 1, points[i].x, points[i].y + 5);
        ctx.closePath();
    }
}

function drawLines(){
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.line;
    let len = points.length;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    for(let i = 0; i < len - 1; i++) {
        for (let j = i + 1; j < len; j++) {
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
        }
    }
    ctx.stroke();
    ctx.closePath();
}

function drawShortRoute() {
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.line;
    if (answerIsFound) {
        ctx.strokeStyle = 'rgba(0,255,255,1)';
        ctx.shadowColor = 'rgba(0,255,255,1)';
    } else {
        ctx.strokeStyle = 'rgba(255,255,255,1)';
        ctx.shadowColor = 'rgba(255,255,255,1)';
    }
    ctx.shadowBlur = 5;
    let len = points.length;
    for (let i = 0; i < len - 1; i++){
        ctx.moveTo(points[shortestRoute[i]].x, points[shortestRoute[i]].y);
        ctx.lineTo(points[shortestRoute[i + 1]].x, points[shortestRoute[i + 1]].y);
    }
    ctx.moveTo(points[shortestRoute[0]].x, points[shortestRoute[0]].y);
    ctx.lineTo(points[shortestRoute[len - 1]].x, points[shortestRoute[len - 1]].y);
    ctx.stroke();
    ctx.closePath();
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}

function redrawGraph(){
    ctx.reset();
    if (showLines){
        drawLines();
    }
    if (answerIsFound || searchingRoute){
        drawShortRoute();
    }
    drawPoints();
}

export function resetInterval() {
    clearInterval(interval);
    interval = null;
}

