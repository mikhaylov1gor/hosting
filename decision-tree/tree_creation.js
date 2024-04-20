import {attributes, classMatrix} from './settings.js'
import {TreeNode} from './tree_data.js'
import {sortAttributes, uniqueClasses} from './calculate_gain_ratio.js'

export let root;

// Получение индекса аттрибута
export function getAttributeIndex(nameAttribute){
    for (let i = 0; i < attributes.length; i++){
        if (attributes[i] === nameAttribute){
            return i;
        }
    }
}

// Получение вероятного уникального класса
function getProbableClass(node, child, attributeIndex){
    let probableClass = uniqueClasses[attributeIndex][0];
    let index = 0;

    for (let i = 0; i < uniqueClasses[attributeIndex].length; i++){
        if (probableClass.amount < uniqueClasses[attributeIndex][i].amount
               && child.class === classMatrix[getAttributeIndex(node.attribute)][i]){
            probableClass = uniqueClasses[attributeIndex][i];
            index = i;
        }
    }

    return index;
}

// Удаление ненужных веток
function removeBranches(attribute, classValue, branches){
    let attributeIndex = getAttributeIndex(attribute);
    let newBranch = [];

    for (let branchIndex of branches){
        if (classValue === classMatrix[branchIndex][attributeIndex]){
            newBranch.push(branchIndex);
        }
    }

    return newBranch;
}

// Получение вероятного конечного листа
function getProbableLeaf(branches){
    let leaves = [];
    let attributeIndex = attributes.length - 1;

    for (let branchIndex of branches){
        if (!leaves.includes(classMatrix[branchIndex][attributeIndex])){
            leaves.push(classMatrix[branchIndex][attributeIndex]);
        }
    }

    if (leaves.length === 1){
        return leaves;
    }

    let count = [];
    for (let i = 0; i < leaves.length; i++){
        count[i] = 0;
        for (let j = 0; j < branches.length; j++){
            if (leaves[i] === classMatrix[branches[j]][attributeIndex]){
                count[i]++;
            }
        }
    }

    for (let i = 0; i < leaves.length; i++){
        for (let j = 0; j < leaves.length; j++){
            if (count[i] > count[j]){
                [count[i],count[j]] = [count[j],count[i]];
                [leaves[i],leaves[j]] = [leaves[j],leaves[i]];
            }
        }
    }

    return leaves;
}

// Добавление конечных листьев
let numberLeaf = 0;
function createLeaves(attribute, node, branches) {
    if (node.children.length === 0){
        let leaf = getProbableLeaf(branches)[0];
        node.addChild(new TreeNode("", leaf));
        node.attribute = attributes[attributes.length - 1] + numberLeaf;
        numberLeaf++;
        return;
    }

    for (let child of node.children){
        let newBranches = removeBranches(node.attribute, child.class, branches);
        if (newBranches.length === 0){
            newBranches.push(getProbableClass(node, child, getAttributeIndex(node.attribute)));
        }
        createLeaves(node.attribute, child, newBranches);
    }
}

// Создание структуры дерева
export function createStructure(){
    sortAttributes();

    let indexAttribute = getAttributeIndex(attributes[0]);
    root = new TreeNode(attributes[indexAttribute], "");

    let queue = [];
    queue.push(root);

    let count = 1;
    while (queue.length > 0){
        let node = queue.shift();
        indexAttribute = getAttributeIndex(node.attribute);
        let amountUniqueClasses = uniqueClasses[indexAttribute].length;

        for (let i = 0; i < amountUniqueClasses; i++) {
            let child = new TreeNode(attributes[count], uniqueClasses[indexAttribute][i].class);
            node.addChild(child)
            count++;

            if (count < attributes.length) {
                queue.push(child);
            }
        }
    }

    let branches = []
    for (let i = 0; i < classMatrix.length; i++){
        branches.push(i);
    }

    createLeaves(root.attribute, root, branches)
}

// Создание дерева в html
export function createTreeHtml(node, parent) {
    let html = '<div class="node">';

    if (node.attribute) {
        if (node !== root) {
            html += '<div id="' + parent.attribute + '-' + node.class + '"  class="class">' + node.class + '</div>';
        }
        if (node.attribute.includes(attributes[attributes.length - 1])){
            html += '<div id="' + node.attribute + '" class="node-label">'
                + attributes[attributes.length - 1] + '</div>';
        } else {
            html += '<div id="' + node.attribute + '" class="node-label">'
                + node.attribute + '</div>';
        }

        html += '<div class="children">';
        let count = 0;
        for (const child of node.children) {
            html += createTreeHtml(child, node, count);
            count++;
        }
        html += '</div>';
    } else {
        html += '<div id="' + "leaf" + parent.attribute + '" class="node-label">' + node.class + '</div>';
    }

    html += '</div>';
    return html;
}

const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

// Установка позиции для класса
function setClassPosition(parent, node){
    const parentRect = document.getElementById(parent).getBoundingClientRect();
    const nodeClass = document.getElementById(parent + "-" + node);
    const nodeClassRect = nodeClass.getBoundingClientRect();
    const middleParent = (parentRect.left + parentRect.right) / 2;
    const middleClass = (nodeClassRect.left + nodeClassRect.right) / 2;
    nodeClass.style.left = (middleParent + middleClass) / 2 - middleClass + "px";
}

function drawLine(x1, y1, x2, y2){
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(255,255,255,1)';
    ctx.shadowBlur = 5;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// Рисования линий между родителями и детьми
export function drawLines(node){
    const element = document.getElementById(node.attribute);
    const elementRect = element.getBoundingClientRect();
    const x = ((elementRect.left + elementRect.right) / 2) - canvas.getBoundingClientRect().left;
    const y = elementRect.bottom - canvas.getBoundingClientRect().top;

    if (node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
            const child = document.getElementById(node.children[i].attribute);

            if (node.children[i].attribute !== '') {
                setClassPosition(node.attribute, node.children[i].class);
                const childRect = child.getBoundingClientRect();
                const childX = (childRect.left + childRect.right) / 2 - canvas.getBoundingClientRect().left;
                const childY = childRect.top - canvas.getBoundingClientRect().top;
                drawLine(x, y + 4, childX, childY - 4);
                drawLines(node.children[i])
            } else {
                drawLine(x, y + 4, x, y + 14);
            }
        }
    }
}


