import {drawKMeansClusters} from "../draw_utils.js";
import {canvas, kmeansClusters, dots, kmeansClustersCount} from "../script.js";
import {getDistance} from "../metrics.js";
import {Group} from "./KMeans_group_class.js";
import {getRandomColor} from "../color_util.js";

export function KMeansGroupsInit () {

    kmeansClusters.length = 0;

    for (let i = 0; i < kmeansClustersCount; i++) {
        let g = new Group(i, getRandomColor());
        kmeansClusters.push(g);
    }
}

export function moveCenter() {
    let finished = false;
    kmeansClusters.forEach((group) => {
        finished = true;

        if (group.dots.length === 0) {
            group.center = {x: Math.random() * canvas.width, y: Math.random() * canvas.height}
            return;
        }

        let x = 0;
        let y = 0;
        group.dots.forEach((dot) => {
            x += dot.x;
            y += dot.y;
        })

        group.center = {
            x: x / group.dots.length,
            y: y / group.dots.length
        }
    })
}


export function updateGroups() {
    kmeansClusters.forEach((g) => {g.dots = [];})
    dots.forEach((dot) => {
        let min = Infinity;
        let group;
        kmeansClusters.forEach((g) => {
            let d = getDistance(g.center, dot);
            if (d < min) {
                min = d;
                group = g;
            }
        });
        group.dots.push(dot);
        dot.group = group;
    })
}

function isCentersChange(previousClusters) {
    for (let i = 0; i < kmeansClusters.length; i++) {
        let firstCenter = previousClusters[i].center;
        let secondCenter = kmeansClusters[i].center;

        if (Math.sqrt(Math.pow(firstCenter.x - secondCenter.x, 2) + Math.pow(firstCenter.y - secondCenter.y, 2)) > 0) {
            console.log(1)
            return true;
        }
    }
    return false;
}

export function kMeansClustering() {
    let previousClusters = kmeansClusters.map(cluster => ({ ...cluster }));

    for (;;) {
        previousClusters = kmeansClusters.map(cluster => ({ ...cluster }));
        updateGroups();
        moveCenter();
        if (!isCentersChange(previousClusters)) break;
    }
    drawKMeansClusters();
}
