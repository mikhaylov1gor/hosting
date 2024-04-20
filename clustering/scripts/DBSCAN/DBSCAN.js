import {dbscanClusters, dbscanDotsCluster, dbscanEps, dbscanPointCount, dbscanUsedDots, dots} from "../script.js";
import {getDistance} from "../metrics.js";
import {Group} from "./dbscan_group_class.js";
import {getRandomColor} from "../color_util.js";
import {drawDbscanClusters} from "../draw_utils.js";

export function getNeighbors(dot) {
    let neighbors = [];
    for (let i = 0; i < dots.length; i++) {
        if (!(dots[i].x === dot.x && dots[i].y === dot.y) && getDistance(dots[i], dot) <= dbscanEps) {
            neighbors.push(i);
        }
    }

    return neighbors;
}
export function updateCluster(dotIndex, neighbors, cluster) {
    cluster.dots.push(dots[dotIndex]);
    dbscanDotsCluster[dotIndex] = dbscanClusters.length;

    for (let neighbor of neighbors) {
        if (dbscanUsedDots[neighbor] !== 1) {
            dbscanUsedDots[neighbor] = 1;
            let currentDotNeighbors = getNeighbors(dots[neighbor]);
            if (currentDotNeighbors.length >= dbscanPointCount) {
                neighbors.push(...currentDotNeighbors);
            }
        }
        if (dbscanDotsCluster[neighbor] === -1) {
            dbscanDotsCluster[neighbor] = dbscanClusters.length;
            cluster.dots.push(dots[neighbor]);
        }
    }
}

export function dbscanClustering() {
    dbscanClusters.length = 0;
    dbscanDotsCluster.length = dots.length;
    dbscanUsedDots.length = dots.length;

    for (let i = 0; i < dots.length; i++) {
        dbscanDotsCluster[i] = -1;
        dbscanUsedDots[i] = 0;
    }

    for (let i = 0; i < dots.length; i++) {
        if (dbscanUsedDots[i] !== 1) {
            dbscanUsedDots[i] = 1;
            let neighbors = getNeighbors(dots[i]);
            if (neighbors.length < dbscanPointCount) {
                dbscanDotsCluster[i] = -1;
            }
            else {
                let cluster = new Group(getRandomColor());
                updateCluster(i, neighbors, cluster);
                dbscanClusters.push(cluster);
            }
        }
    }

    drawDbscanClusters();
}