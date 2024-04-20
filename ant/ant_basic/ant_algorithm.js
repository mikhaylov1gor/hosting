import {slider, antCount, iterateCount, points, draw, lock, unlock} from './field.js'

const alpha = 1;
const beta = 1;
const p = 0.4;
const q = 240;
const startPheromone = 0.2;

function reset(){
    matrixInit();
    bestPathLength = Number.MAX_VALUE;
    bestPath = [];
}
function matrixInit(){
    for (let i=0; i < points.length; i++){
        pheromoneMatrix[i] = [];

        for (let j= 0; j < points.length; j++){
            pheromoneMatrix[i][j] = startPheromone;
        }
    }
}

function calculateDistance(index1,index2){
    return Math.sqrt(Math.pow(Math.abs(points[index1].x - points[index2].x),2) + Math.pow(Math.abs(points[index1].y - points[index2].y),2));
}

function calculatePathLength(path){
    let len = 0

    for (let j = 1; j < path.length; j++){
        len+=calculateDistance(path[j],path[j-1]);
    }

    return len;
}

function probability(currentIndex,unvisited){
    let chances =[];
    let sum= 0;

    for (let i = 0; i < unvisited.length; i++){
        let currentChance = Math.pow(pheromoneMatrix[currentIndex][unvisited[i]],alpha) * Math.pow(1 / calculateDistance(currentIndex,unvisited[i]),beta);
        chances.push(currentChance);
        sum+=currentChance;
    }

    for (let i = 0; i < unvisited.length; i++){
        chances[i] /= sum;
    }
    return chances;
}

function nextPoint(chances){
    let random = Math.random();
    let sum = 0;

    for (let i = 0; i < chances.length; i++){
        sum+=chances[i];
        if (sum>=random){
            return i;
        }
    }
}

function update(paths) {
    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < points.length; j++) {
            pheromoneMatrix[i][j] *= (1 - p);
        }
    }

    for (let i = 0; i < antCount.value; i++) {
        let path = paths[i];

        let len = calculatePathLength(path);
        let delta = q / len;

        if (len < bestPathLength) {
            bestPath = path;
            bestPathLength = len;
        }

        for (let j = 1; j < path.length; j++) {
            pheromoneMatrix[path[j - 1]][path[j]] += delta;
            pheromoneMatrix[path[j]][path[j - 1]] += delta;
        }
    }
}

function antMove(startIndex){
    let unvisited =[];

    for (let i = 0; i < points.length;i++){
        unvisited.push(i);
    }

    unvisited.splice(startIndex,1);
    let path=[];
    path.push(startIndex);

    while (unvisited.length > 0){
        let chances = probability(path[path.length-1], unvisited);
        let nextIndex = nextPoint(chances);

        path.push(unvisited[nextIndex]);
        unvisited.splice(nextIndex, 1);
    }
    path.push(startIndex);
    return path;
}

function iterate(){
    let paths = [];

    for (let i =0; i < antCount.value; i++){
        paths.push(antMove(Math.floor(Math.random()*points.length)));
    }
    update(paths);
}

function antAlgorithm(){
    if (points.length < 3) {alert("Слишком мало cities"); return;}
    lock();
    reset();
    matrixInit();

    let i = 0;
    function visualize() {
        if (i >= iterateCount.value) {
            draw(bestPath,'blue');
            unlock();
            return;
        }
        else if (i < iterateCount.value){
            i++;
            iterate();

            // вывод информации на экран
            let outputIterates = document.getElementById("iteratesCount");
            let outputDistance = document.getElementById("value-block-value");
            outputDistance.innerHTML = Math.floor(bestPathLength);
            outputIterates.innerHTML = i;
            draw(bestPath,'navajowhite');
        }
        setTimeout(visualize, (100 - slider.value) * 2);
    }
    visualize();
    clearInterval(visualize);
}

let bestPath =[];
let pheromoneMatrix = [];
let bestPathLength = Number.MAX_VALUE;

export {bestPath};
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('start').addEventListener('click',antAlgorithm);
    document.getElementById('delete').addEventListener('click',reset);
});