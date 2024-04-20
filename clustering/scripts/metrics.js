import {metricSelector} from "./script.js";

export function getDistance(firstDot, secondDot) {
    let selected = metricSelector.value;

    switch (selected) {
        case 'euklid': return Math.sqrt(Math.pow(firstDot.x - secondDot.x, 2) + Math.pow(firstDot.y - secondDot.y, 2));
        case 'double_euklid': return Math.pow(firstDot.x - secondDot.x, 2) + Math.pow(firstDot.y - secondDot.y, 2);
        case 'manhattan': return Math.abs(firstDot.x - secondDot.x) + Math.abs(firstDot.y - secondDot.y);
        case 'chebysh': return Math.max(Math.abs(firstDot.x - secondDot.x), Math.abs(firstDot.y - secondDot.y));
    }
}