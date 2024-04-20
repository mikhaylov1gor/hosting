
import {clearAndReset, draw, startDrawing, stopDrawing} from "./draw_utils.js";
import {main_clustering} from "./main_clustering.js"
export let kmeansClusters = []
export let hierarchicalClusters = []
export let dbscanClusters = [];
export let dots = [];
export let minDistance = 20;
export let squareSize = 10;
export let kmeansClustersCount = 2;
export let hierarchicalClustersCount = 2;
export let dbscanEps = 35;
export let dbscanPointCount = 5;
export let dbscanDotsCluster = [];

export let dbscanUsedDots = [];


export const canvas = document.getElementById('cluster_canvas');
export const btn = document.getElementById('draw_button');
const cbtn = document.getElementById('clear_button');
const infoBtn = document.getElementById('info_button');
export const metricSelector = document.getElementById('select_metric');
export const kmeansClustersSlider = document.getElementById('select_kmeans_clusters');
export const hierarchicalClustersSlider = document.getElementById('select_hierarchical_clusters');
export const dbscanRadiusSlider = document.getElementById('select_dbscan_radius');
export const dbscanDotsRadiusSlider = document.getElementById('select_dbscan_radius_dots');

export let fetchKmeansClustersCount = document.getElementById('kmeans_clusters_count');
export let fetchHierarchicalClustersCount = document.getElementById('hierarchical_clusters_count');
export let fetchDbscanRadius = document.getElementById('dbscan_radius');
export let fetchDbscanDotsRadius = document.getElementById('dbscan_dots');
fetchKmeansClustersCount.innerHTML = kmeansClustersCount;
fetchHierarchicalClustersCount.innerHTML = hierarchicalClustersCount;
fetchDbscanRadius.innerHTML = dbscanEps;
fetchDbscanDotsRadius.innerHTML = dbscanPointCount;

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
export let ctx = canvas.getContext('2d');

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
canvas.addEventListener('mousedown', startDrawing);
cbtn.addEventListener('click', clearAndReset)
btn.addEventListener('click', function (){main_clustering(dots)});
infoBtn.addEventListener('click', () => {alert("Как определять кластеры и методы:\n\nЛинии от точек до квадратов(центроидов): Kmeans.\nЦвет верхней части точки: Иерархический\nЦвет нижней части точки: DBSCAN.")})
kmeansClustersSlider.addEventListener('input', () => {
    fetchKmeansClustersCount.textContent = kmeansClustersSlider.value;
    kmeansClustersCount = kmeansClustersSlider.value;
});
hierarchicalClustersSlider.addEventListener('input', () => {
    fetchHierarchicalClustersCount.textContent = hierarchicalClustersSlider.value;
    hierarchicalClustersCount = hierarchicalClustersSlider.value;
});
dbscanRadiusSlider.addEventListener('input', () => {
    fetchDbscanRadius.textContent = dbscanRadiusSlider.value;
    dbscanEps = dbscanRadiusSlider.value;
});
dbscanDotsRadiusSlider.addEventListener('input', () => {
    fetchDbscanDotsRadius.textContent = dbscanDotsRadiusSlider.value;
    dbscanPointCount = dbscanDotsRadiusSlider.value;
});




