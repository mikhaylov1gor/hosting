import { searchingRoute, resetInterval, findRoute } from './canvas.js';

export let timeout;
export let populationSize = 3000;
export let amountGeneration = 3000;
export let mutation = 0.5;

const sliderSpeed = document.getElementById('slider-speed');
const speedValue = document.getElementById('speed-value');
sliderSpeed.addEventListener('input', function (){
    speedValue.innerHTML = sliderSpeed.value;
    timeout = 100 - sliderSpeed.value;
    console.log(timeout);
    if(timeout === 100){
        timeout = 100000000;
    }
    if(searchingRoute){
        resetInterval();
        findRoute();
    }
});

const sliderPopulationSize = document.getElementById('slider-population-size');
const populationSizeValue = document.getElementById('population-size-value');
sliderPopulationSize.addEventListener('input', function (){
    populationSize = sliderPopulationSize.value ;
    populationSizeValue.innerHTML = populationSize;
    if(searchingRoute){
        resetInterval();
        findRoute();
    }
});

const sliderAmountGeneration = document.getElementById('slider-amount-generation');
const amountGenerationValue = document.getElementById('amount-generation-value');
sliderAmountGeneration.addEventListener('input', function (){
    populationSize = sliderAmountGeneration.value ;
    amountGenerationValue.innerHTML = populationSize;
    if(searchingRoute){
        resetInterval();
        findRoute();
    }
});

const sliderMutation = document.getElementById('slider-mutation');
const mutationValue = document.getElementById('mutation-value');
sliderMutation.addEventListener('input', function (){
    mutation = sliderMutation.value / 100;
    mutationValue.innerHTML = sliderMutation.value;
    if(searchingRoute){
        resetInterval();
        findRoute();
    }
});

const shortestDistance = document.getElementById('shortest-distance-value');
export function showShortestDistance(value) {
    shortestDistance.innerHTML = value;
}



