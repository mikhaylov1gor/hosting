import {
    ctx,
    canvas,
    squareSize,
    minDistance,
    dots,
    hierarchicalClusters,
    kmeansClusters, dbscanClusters,
} from "./script.js";
import {Dot} from "./dot_class.js";

let isDrawing = false;


export function stopDrawing() {
    isDrawing = false;
}

export function startDrawing() {
    isDrawing = true;
    draw();
}

export function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function clearAndReset() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hierarchicalClusters.length = 0;
    kmeansClusters.length = 0;
    dots.length = 0;
}
function isOverlap(newDot) {
    if (dots.length === 0) return false;
    for (let dot of dots) {
        const distanceX = newDot.x - dot.x;
        const distanceY = newDot.y - dot.y;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (distance < minDistance) {
            return true;
        }
    }
    return false;
}

export function drawKMeansClusters() {
    kmeansClusters.forEach((c) => {
        c.dots.forEach((d) => {
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(c.center.x + 5, c.center.y + 5);
            ctx.stroke();
        })
        ctx.beginPath();
        ctx.fillStyle = "#777";
        ctx.rect(c.center.x, c.center.y, squareSize, squareSize);
        ctx.stroke();
    })
}


export function drawHierarchicalClusters() {
    hierarchicalClusters.forEach((c) => {
        c.dots.forEach((d) => {
            ctx.beginPath();
            ctx.arc(d.x, d.y, 10, Math.PI, 2 * Math.PI);
            ctx.closePath();
            ctx.fillStyle = c.color;
            ctx.fill();

        })
    })
}

export function drawDbscanClusters() {
    dbscanClusters.forEach((c) => {
        c.dots.forEach((d) => {
            ctx.beginPath();
            ctx.arc(d.x, d.y, 10, 0, Math.PI);
            ctx.closePath();
            ctx.fillStyle = c.color;
            ctx.fill();
        })
    })
}

export function drawDefault() {
    dots.forEach((dot) => {
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.arc(dot.x, dot.y, 10, 0, Math.PI * 2);
        ctx.fill();
    })
}

export function draw() {
    if (!isDrawing) return;

    const x = event.offsetX;
    const y = event.offsetY;


    let dot = new Dot(x, y);
    if (!isOverlap({x, y})) {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
        dots.push(dot)
    }
}
