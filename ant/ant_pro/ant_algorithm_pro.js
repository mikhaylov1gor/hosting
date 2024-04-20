import{slider,drawMap,antCount,colonyPos} from "./field.js";
const searchRadius = 35;

class Pheromone {
    constructor(){
        this.home = 0;
        this.food = 0;
        this.family = 0;
    }
}
class Ant {
    constructor(x, y, nation) {
        this.x = x;
        this.y = y;
        this.direction = Math.random() * 2 * Math.PI;
        this.speed = Math.random() * 2 + 1;
        this.goHome = false;
        this.following = false;
        this.pheromonePath = [];
        this.hot = 1;
        this.timeWithout = 0;
        this.nation = nation;
        this.class = 'soldier'
    }

    moveAnt() {
        this.direction += (Math.random() - 0.5) * 0.5;
        this.x += this.speed * Math.cos(this.direction);
        this.y += this.speed * Math.sin(this.direction);
    }

    followAnt() {
        let maxPheromone = -Infinity;
        let maxPheromoneX = this.x;
        let maxPheromoneY = this.y;
        let rnd = Math.random();

        for (let dx = -searchRadius; dx <= searchRadius; dx++) {
            for (let dy = -searchRadius; dy <= searchRadius; dy++) {
                let newX = Math.floor(this.x) + dx;
                let newY = Math.floor(this.y) + dy;

                if (newX >= 0 && newX < 750 && newY >= 0 && newY < 500) {
                    if (this.goHome) {
                        let currentPheromone = pheromones[newX][newY].home;

                        if (currentPheromone > maxPheromone && currentPheromone !== 0 && pheromones[newX][newY].family === this.nation) {
                            maxPheromone = currentPheromone;
                            maxPheromoneX = newX;
                            maxPheromoneY = newY;
                        }
                    } else {
                        let currentPheromone = pheromones[newX][newY].food;

                        if (currentPheromone > maxPheromone && currentPheromone !== 0 && pheromones[newX][newY].family === this.nation) {
                            maxPheromone = currentPheromone;
                            maxPheromoneX = newX;
                            maxPheromoneY = newY;
                        }
                    }
                }
            }
        }

        if (maxPheromone === -Infinity || rnd < 0.1) {
            this.moveAnt();
        } else {
            let angleToMaxPheromone = Math.atan2(maxPheromoneY - this.y, maxPheromoneX - this.x);
            this.x += this.speed * Math.cos(angleToMaxPheromone);
            this.y += this.speed * Math.sin(angleToMaxPheromone);
        }

        // избегание стенок при следовании
        if (Math.floor(this.x)>6 && Math.floor(this.y)>6 && Math.floor(this.x)<494 && Math.floor(this.y)<744) {
            if (map[Math.floor(this.x) - 5][Math.floor(this.y)] === -1) {
                this.x += 5;
            }
            if (map[Math.floor(this.x) + 5][Math.floor(this.y)] === -1) {
                this.x -=5;
            }
            if (map[Math.floor(this.x)][Math.floor(this.y) - 5] === -1) {
                this.y += 5;
            }
            if (map[Math.floor(this.x)][Math.floor(this.y) + 5] === -1) {
                this.y -= 5;
            }
        }
    }

    sniffPheromone(){
        for (let dx = -searchRadius; dx <= searchRadius; dx++) {
            for (let dy = -searchRadius; dy <= searchRadius; dy++) {
                let newX = Math.floor(this.x) + dx;
                let newY = Math.floor(this.y) + dy;
                if (newX >= 0 && newX < 750 && newY >= 0 && newY < 500) {
                    if (this.goHome) {
                        if (pheromones[newX][newY].home > 0 && pheromones[newX][newY].family === this.nation) {
                            return true;
                        }
                    } else {
                        if (pheromones[newX][newY].food > 0 && pheromones[newX][newY].family === this.nation) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    updateAnt(){
        let prevMove=[this.x,this.y];

        // мувы муравьишки
        if (this.hot < 0.001){this.hot = 0;}

        if (this.sniffPheromone()){this.following =true;}

        if (this.class === 'scout' && !this.goHome){this.following = false;}

        if (this.following){this.followAnt();}
        else {this.moveAnt()}

        if (!this.goHome && (this.timeWithout > 700 && this.class === 'scout' || this.timeWithout > 1500)){
            this.hot = 0;
            this.goHome = true;
        }

        // выход за границы или стенка
        if (this.x < 1 || this.x > 749 || this.y < 1 || this.y > 499 || map[Math.floor(this.x)][Math.floor(this.y)] === -1){
            this.x = prevMove[0];
            this.y = prevMove[1];
            this.direction += Math.PI;
            this.following = false;
        }

        // еда
        if (map[Math.floor(this.x)][Math.floor(this.y)] === -2){
            if (this.goHome === false){
                this.goHome = true;

                if (!this.sniffPheromone()){
                    this.following = false;
                }
                this.direction += Math.PI;
            }

            this.hot = 1;
            this.timeWithout = 0;
        }

        // дом
        if (this.nation === 0 && Math.abs(this.x - colonyPos[0].x) < 2 && Math.abs(this.y - colonyPos[0].y) < 2 ||
            this.nation === 1 && Math.abs(this.x - colonyPos[1].x) < 2 && Math.abs(this.y - colonyPos[1].y) < 2){
            if (this.goHome === true){
                this.goHome = false;
            }
            if (!this.sniffPheromone()){
                this.following = false;
            }

            this.hot = 1;
            this.timeWithout = 0;
        }

        // оставление феромонов
        if(this.timeWithout%8===0) {
            if (this.goHome === false) {
                pheromones[Math.floor(this.x + 1)][Math.floor(this.y)].home = 400 * this.hot;
                pheromones[Math.floor(this.x - 1)][Math.floor(this.y)].home = 400 * this.hot;
                pheromones[Math.floor(this.x)][Math.floor(this.y + 1)].home = 400 * this.hot;
                pheromones[Math.floor(this.x)][Math.floor(this.y - 1)].home = 400 * this.hot;
            } else {
                pheromones[Math.floor(this.x + 1)][Math.floor(this.y)].food = 800 * this.hot;
                pheromones[Math.floor(this.x - 1)][Math.floor(this.y)].food = 800 * this.hot;
                pheromones[Math.floor(this.x)][Math.floor(this.y + 1)].food = 800 * this.hot;
                pheromones[Math.floor(this.x)][Math.floor(this.y - 1)].food = 800 * this.hot;
            }
            pheromones[Math.floor(this.x + 1)][Math.floor(this.y)].family = this.nation;
            pheromones[Math.floor(this.x - 1)][Math.floor(this.y)].family = this.nation;
            pheromones[Math.floor(this.x)][Math.floor(this.y + 1)].family = this.nation;
            pheromones[Math.floor(this.x)][Math.floor(this.y - 1)].family = this.nation;
            this.pheromonePath.push({x: Math.floor(this.x + 1), y: Math.floor(this.y)});
            this.pheromonePath.push({x: Math.floor(this.x - 1), y: Math.floor(this.y)});
            this.pheromonePath.push({x: Math.floor(this.x), y: Math.floor(this.y + 1)});
            this.pheromonePath.push({x: Math.floor(this.x), y: Math.floor(this.y - 1)});
        }
        this.hot*=0.99;
        this.timeWithout ++;
    }
}

function reset(){
    ants = [];

    for (let i = 0;i<750;i++){
        pheromones[i]=[];

        for (let j = 0; j < 500; j++) {
            pheromones[i][j] = new Pheromone();
        }
    }
}

function mapInit(){
    ants = [];

    for (let i = 0;i<750;i++){
        pheromones[i]=[];
        map[i]=[];

        for (let j = 0; j < 500; j++) {
            pheromones[i][j] = new Pheromone();
        }
    }
}
function antAlgorithm(){
    if (isStarted){
        reset();
        isStarted = false;
        return;
    }

    if (colonyPos.length === 0) {alert('Поставьте колонию'); return;}

    isStarted = true;
    // создание муравьев
    for (let i = 0;i <colonyPos.length;i++) {
        for (let j = 0; j < antCount.value/colonyPos.length; j++) {
            ants.push(new Ant(colonyPos[i].x, colonyPos[i].y,i));

            if (j < antCount.value/colonyPos.length/5){
                ants[ants.length - 1].class = 'scout';
            }
        }
    }
    function visualize(){
        if (ants.length === 0){
            return;
        }

        for (let i = 0;i<ants.length;i++){
            ants[i].updateAnt();

            if (ants[i].timeWithout > 2000){
                ants.splice(i,1);
            }
        }

        // вывод информации на экран
        drawMap(ants);
        let outputDistance = document.getElementById("value-block-value");
        outputDistance.innerHTML = Math.floor(ants.length);
        setTimeout(visualize,100-slider.value);
    }
    visualize();
    clearInterval(visualize);
}
let map = [];
let pheromones = [];
let ants = [];
let isStarted = false;

export {map,pheromones,reset,ants};
document.addEventListener('DOMContentLoaded', () => {
    mapInit();
    document.getElementById('start').addEventListener('click', antAlgorithm);
});