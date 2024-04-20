import {dots, hierarchicalClusters, hierarchicalClustersCount} from "../script.js";
import {drawHierarchicalClusters} from "../draw_utils.js";
import {Group} from "./hierarchical_group_class.js";
import {getRandomColor} from "../color_util.js";
import {getDistance} from "../metrics.js";

export function hierarchicalGroupsInit() {
    hierarchicalClusters.length = 0;
    dots.forEach((dot, index) => {
        let g = new Group(getRandomColor());
        g.dots.push(dot);
        hierarchicalClusters.push(g);
        g.color = getRandomColor();
    })
}

function getDotsDistance(firstDot, secondDot) {
    return getDistance(firstDot, secondDot);
}
function clustersMerge(indexClustersPair) {
    let newCluster = new Group(getRandomColor());
    newCluster.dots.push(...hierarchicalClusters[indexClustersPair.i].dots, ...hierarchicalClusters[indexClustersPair.j].dots);

    hierarchicalClusters.splice(indexClustersPair.i, 1);
    hierarchicalClusters.splice(indexClustersPair.j - 1, 1);

    return newCluster;
}

export function hierarchicalClustering() {

    while (hierarchicalClusters.length > hierarchicalClustersCount) {
        let minDist = Infinity;
        let nearestClustersPair = {i: 0, j: 0};
        let i = 0;
        while (i < hierarchicalClusters.length) {
            let j = i + 1;
            while (j < hierarchicalClusters.length) {
                let currDist = getClustersDistance(i , j);
                if (currDist < minDist) {
                    nearestClustersPair = {i: i, j: j};
                    minDist = currDist;
                }
                j++;
            }
            i++;
        }
        hierarchicalClusters.push(clustersMerge(nearestClustersPair));
    }

    drawHierarchicalClusters();
}

function getClustersDistance(firstIndex, secondIndex) {
    let minDist = Infinity;
    hierarchicalClusters[firstIndex].dots.forEach(function (firstDot) {
        hierarchicalClusters[secondIndex].dots.forEach(function (secondDot) {
            if (getDotsDistance(firstDot, secondDot) < minDist) {
                minDist = getDotsDistance(firstDot, secondDot);
            }
        })
    })

    return minDist;
}