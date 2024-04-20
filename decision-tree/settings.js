import {createStructure, createTreeHtml, drawLines, root, ctx} from './tree_creation.js'
import {treeBypassing} from './tree_bypassing.js'
import {treeOptimization} from "./tree_optimization.js";
import {uniqueClasses} from "./calculate_gain_ratio.js";

export let isBypassing;
export let attributes;
export let copyAttributes;
export let classMatrix;
export let path;
export let treeHTML = document.getElementById('tree');

// Удаление дерева
function deleteTree(node){
    while (node.children.length > 0){
        deleteTree(node.children[node.children.length - 1]);
        node.children.pop();
    }
    node = null;
}

export function inverseIsBypassing(){
    isBypassing = !isBypassing;
}

// Обновление всего
export function reset(){
    result.innerHTML = '';
    treeHTML.innerHTML = '';
    classMatrix = [];
    attributes = [];
    copyAttributes = [];
    path = [];
    entryField.value = '';
    isBypassing = false;
    ctx.reset();
    if (root){
        deleteTree(root);
    }
}

// Загрузка csv-файла
const inputFileButton = document.getElementById('upload-tree');
inputFileButton.addEventListener('change', function() {
    reset();
    let file = this.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const content = e.target.result;
        const lines = content.split('\n');
        readDataset(lines);
    };
    reader.readAsText(file);
});

export function readDataset(dataset){
    dataset[0].split(',').forEach(attribute => attributes.push(attribute.trim()));
    attributes.forEach(attribute => copyAttributes.push(attribute));
    for (let i = 1; i < dataset.length - 1; i++){
        let row = [];
        dataset[i].split(',').forEach(elem => row.push(elem.trim()));
        classMatrix.push(row);
    }
}

function treeOutput(){
    result.innerHTML = '';
    treeHTML.innerHTML = createTreeHtml(root);
    ctx.reset();
    drawLines(root);
}

// Построение дерева
const buildTreeButton = document.getElementById('build-tree');
buildTreeButton.addEventListener('click',function (){
    if (!attributes){
        alert("Загрузите csv-файл");
        return;
    }
    if(root){
        deleteTree(root);
    }
    if (!root || root.children.length === 0) {
        createStructure();
    }
    isBypassing = false;
    treeOutput();
});

// Удаление всего
const deleteTreeButton = document.getElementById('delete-tree');
deleteTreeButton.addEventListener('click',function (){
    result.innerHTML = '';
    treeHTML.innerHTML = '';
    entryField.value = '';
    inputPath = '';
    path = [];
    ctx.reset();
    isBypassing = false;
});

// Обход по маршруту
const startBypassingButton = document.getElementById('start-bypassing');
startBypassingButton.addEventListener('click', function (){
    if (isBypassing) {
        alert("Дождитесь завершения обхода");
        return;
    }
    if (!root || root.children.length === 0 || treeHTML.innerHTML === ''){
        alert("Постройте дерево");
        return;
    }
    if (!inputPath){
        alert("Введите принятые решения");
        return;
    }
    path = [];
    inputPath.split(',').forEach(decision => path.push(decision.trim()));
    if (path.length !== attributes.length - 1){
        alert("Введите нужное количество решений");
        return;
    }
    treeOutput();
    isBypassing = true;
    treeBypassing(root)
});

function getRandomClass(attribute){
    for (let i = 0; i < attributes.length - 1; i++){
        if (attribute === attributes[i]){
            const index = Math.floor(Math.random() * uniqueClasses[i].length);
            return uniqueClasses[i][index].class;
        }
    }
}

function createRandomPath(){
    inputPath = '';
    for(let i = 0; i < attributes.length - 1; i++){
        if (i < attributes.length - 2) {
            inputPath += getRandomClass(copyAttributes[i]) + ',';
        } else {
            inputPath += getRandomClass(copyAttributes[i]);
        }
    }
    entryField.value = inputPath;
}

const createRandomPathButton = document.getElementById('create-random-path');
createRandomPathButton.addEventListener('click', function (){
    if (!uniqueClasses.length){
        alert("Постройте дерево");
        return;
    }
    if (isBypassing) {
        alert("Дождитесь завершения обхода");
        return;
    }
    createRandomPath();
});

// Поле ввода решений
let inputPath;
const entryField = document.getElementById('path');
entryField.addEventListener('input', function() {
    if (isBypassing){
        alert("Дождитесь завершения обхода");
        this.value = inputPath;
        return;
    }
    inputPath = this.value;
});

// Отпимизация дерева (удаление лишних веток и листьев)
const treeOptimizationButton = document.getElementById('tree-optimization');
treeOptimizationButton.addEventListener('click', function () {
    if (!root || !attributes || treeHTML.innerHTML === '') {
        alert("Сперва постройте дерево");
        return;
    }
    isBypassing = false;
    treeOptimization(root);
    treeOutput();
});

// Слайдер скорости
const sliderSpeed = document.getElementById('slider-speed');
const speedValue = document.getElementById('speed-value');
export let timeout = 500;
sliderSpeed.addEventListener('input', function (){
    speedValue.innerHTML = sliderSpeed.value;
    if (timeout === 100000000 && isBypassing){
        timeout = 1000 - sliderSpeed.value * 10;
        treeBypassing(root);
        return;
    }
    timeout = 1000 - sliderSpeed.value * 10;
    if(timeout === 1000){
        timeout = 100000000;
    }
});

const result = document.getElementById('result-value');
export function showResult(value) {
    result.innerHTML = value;
}
