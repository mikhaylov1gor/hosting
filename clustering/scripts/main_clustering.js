import {dots, hierarchicalClustersCount, kmeansClustersCount} from "./script.js";
import {hierarchicalGroupsInit} from "./hierarchical/hierarchical.js";
import {KMeansGroupsInit} from "./KMeans/KMeans.js";
import {kMeansClustering} from "./KMeans/KMeans.js";
import {hierarchicalClustering} from "./hierarchical/hierarchical.js";
import {clear} from "./draw_utils.js";
import {dbscanClustering} from "./DBSCAN/DBSCAN.js";

export function main_clustering() {
    if (dots.length === 0) {
        alert("Нанесите частицы!");
        return;
    }

    hierarchicalGroupsInit();
    KMeansGroupsInit();

    if (dots.length < hierarchicalClustersCount || dots.length < kmeansClustersCount) {
        alert("Частиц меньше, чем кластеров!");
        return;
    }
    clear();
    dbscanClustering();
    hierarchicalClustering();
    kMeansClustering();

}