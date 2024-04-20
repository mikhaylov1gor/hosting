import { points } from "./canvas.js";
import { populationSize, amountGeneration, mutation, showShortestDistance } from "./settings.js"
let amountPoints;
let population = [];

// Функция подсчета расстояние между двумя точками
function calculateDistance(pointFirst, pointSecond){
    return Math.sqrt((pointFirst.x - pointSecond.x)**2 + (pointFirst.y - pointSecond.y)**2);
}

// Функция подсчета длины пути
function calculateRoute(route) {
    let totalDistance = 0;
    for (let i = 0; i < amountPoints - 1; i++) {
        totalDistance += calculateDistance(points[route[i]], points[route[i + 1]]);
    }
    totalDistance += calculateDistance(points[route[amountPoints - 1]], points[route[0]]);
    return totalDistance;
}

// Сортировка путей и удаление плохих поколений
function sortRoutes() {
    let distances =[];
    let lenght = population.length;
    for (let i = 0; i < lenght; i++){
        distances.push(calculateRoute(population[i]));
    }
    for (let i = 0; i < lenght - 1; i++){
        for (let j = i + 1; j < lenght; j++){
            if (distances[i] > distances[j]){
                [distances[i], distances[j]] = [distances[j], distances[i]];
                [population[i], population[j]] = [population[j], population[i]];
            }
        }
    }
    showShortestDistance(Math.round(distances[0] * 100) / 100);
    population.splice(-(lenght - populationSize));
}

// Функция мутации
function mutate(route) {
    let lenght  = route.length;
    let firstIndex = Math.floor(Math.random() * lenght);
    let secondIndex = Math.floor(Math.random() * lenght);
    while (firstIndex === secondIndex){
        secondIndex = Math.floor(Math.random() * lenght);
    }
    [route[firstIndex], route[secondIndex]] = [route[secondIndex], route[firstIndex]];
    return route;
}

// Функция скрещивания двух родителей
function crossover(firstParent, secondParent) {
    let delimiter = Math.floor(Math.random() * amountPoints);
    let child = [];
    for (let i = 0; i < delimiter; i++){
        child.push(firstParent[i]);
    }
    for (let i = 0; i < amountPoints; i++) {
        let point = secondParent[i];
        if (!child.includes(point)) {
            child.push(point);
        }
    }
    if (Math.random() < mutation) {
        child = mutate(child);
    }
    return child;
}

// Функция эволюции популяции
function evolvePopulation() {
    for (let i = 0; i < amountGeneration; i++) {
        let firstParent = population[Math.floor(Math.random() * population.length)];
        let secondParent = population[Math.floor(Math.random() * population.length)];
        let child = crossover(firstParent, secondParent);
        if (!population.includes(child)){
            population.push(child);
        } else {
            if (amountPoints >= 8){
                i--;
            }
        }
    }
}

// Смешивание порядка элементов
function shuffle(route) {
    for (let i = 0; i < amountPoints; i++) {
        const j = i + Math.floor(Math.random() * (amountPoints - i));
        [route[i], route[j]] = [route[j], route[i]];
    }
    return route;
}

// Генерация случайного порядка городов
function generateRandomRoute() {
    let route = [];
    for (let i = 0; i < amountPoints; i++) {
        route.push(i);
    }
    return shuffle(route);
}

export function geneticAlgorithm(array) {
    amountPoints = points.length;
    population = array;
    checkPopulationSize();
    evolvePopulation();
    sortRoutes();
    return population;
}

function checkPopulationSize(){
    let lenght = population.length;
    if (lenght < populationSize) {
        for (let i = lenght; i < populationSize; i++) {
            population.push(generateRandomRoute());
        }
    }
    if (lenght > populationSize){
        population.splice(-(lenght - populationSize));
    }
}

