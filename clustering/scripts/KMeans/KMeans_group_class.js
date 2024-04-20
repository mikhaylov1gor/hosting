import {canvas} from "../script.js";

export class Group {
    id;
    dots;
    color;
    center;
    constructor(id, color) {
        this.id = id;
        this.dots = []
        this.color = color;
        this.center = {x: Math.random() * canvas.width, y: Math.random() * canvas.height};
    }
}