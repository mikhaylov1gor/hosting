import {fowardPropagation} from "./NeuralNetwork.js";

const paintbrushSizeSlider = document.getElementById('select_paintbrush_size')
const clearButton = document.getElementById('clear_button')
export const mainCanvas = document.getElementById('main_canvas');
const secondCanvas = document.getElementById('second_canvas')

mainCanvas.width = 500;
mainCanvas.height = 500;
secondCanvas.height = 50;
secondCanvas.width = 50;

export let mainContext = mainCanvas.getContext('2d');
let secondContext = secondCanvas.getContext('2d');

export let isDrawing = false;
export let lineWidth = 25;
export let currentX = 0;
export let currentY = 0;
export let previousX = 0;
export let previousY = 0;

let fetchOutputValue = document.getElementById('output');

let fetchPaintbrushSize = document.getElementById('paintbrush_size');
fetchPaintbrushSize.innerHTML = lineWidth;
paintbrushSizeSlider.addEventListener('input', () => {
    lineWidth = paintbrushSizeSlider.value;
    fetchPaintbrushSize.textContent = paintbrushSizeSlider.value;
})

clearButton.addEventListener('click', () => {
    mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    secondContext.clearRect(0, 0, secondCanvas.width, secondCanvas.height);
    fetchOutputValue.innerHTML = "-";
})
mainCanvas.addEventListener('mousemove', (event) => {
    previousX = currentX;
    previousY = currentY;
    currentX = event.clientX - mainCanvas.offsetLeft;
    currentY = event.clientY - mainCanvas.offsetTop;
    if (!isDrawing) return;

    const dist = Math.sqrt((currentX - previousX) ** 2 + (currentY - previousY) ** 2);
    const angle = Math.atan2(currentY - previousY, currentX - previousX);

    for (let i = 0; i < dist; i += lineWidth / 2) {
        const x = previousX + Math.cos(angle) * i;
        const y = previousY + Math.sin(angle) * i;
        mainContext.beginPath();
        mainContext.arc(x, y, lineWidth / 2, 0, Math.PI * 2);
        mainContext.fillStyle = "black";
        mainContext.fill();
        mainContext.closePath();
    }

    previousX = currentX;
    previousY = currentY;
});
mainCanvas.addEventListener('mouseup', async () => {
    isDrawing = false;
    let correctInputPixels = await getAndScaleImport();
    console.log(correctInputPixels)
    runNeuralNetwork(correctInputPixels);
});
mainCanvas.addEventListener('mouseout', () => {isDrawing = false;});
mainCanvas.addEventListener('mousedown', (event) => {
    isDrawing = true;
    currentX = event.clientX - mainCanvas.offsetLeft;
    currentY = event.clientY - mainCanvas.offsetTop;
});


//переводим изобрвжение в grayscale. т.к. канвас пустой, то по альфа каналу можно отследить степень черности.
//нормализуем 0-255 значение к [0,1], т.к. при обучении тоже выполнялась нормализация к этому интервалу
function toOneDemencityGrayscaleArray(img, size) {
    let GS = Array(size*size)
    console.log(img)
    for (let i = 3; i < img.length; i += 4) {
        GS[Math.floor(i / 4)] = img[i] / 255.0;
    }
    console.log(GS.length)
    return GS;
}

function getImgBorders(img, imgHeight, imgWidth) {

    let borders = []; // left, right, top, bottom

    // Определение левой границы
    for (let x = 0; x < imgWidth; x += 1) {
        let found = false;
        for (let y = 0; y < imgHeight; y+= 1) {
            let currPixelIndex = (y * imgWidth + x);
            if (img[currPixelIndex] != 0) {
                borders.push(x);
                found = true;
                break;
            }
        }
        if (found) break;
    }

    // Определение правой границы
    for (let x = imgWidth - 1; x >= 0; x -= 1) {
        let found = false;
        for (let y = 0; y < imgHeight; y += 1) {
            let currPixelIndex = (y * imgWidth + x);
            if (img[currPixelIndex] != 0) {
                borders.push(Math.min(x + 1, imgWidth));
                found = true;
                break;
            }
        }
        if (found) break;
    }

    // Определение верхней границы
    for (let y = 0; y < imgHeight; y++) {
        let found = false;
        for (let x = 0; x < imgWidth; x++) {
            let currPixelIndex = (y * imgWidth + x);
            if (img[currPixelIndex] != 0) {
                borders.push(y);
                found = true;
                break;
            }
        }
        if (found) break;
    }

    // Определение нижней границы
    for (let y = imgHeight - 1; y >= 0; y--) {
        let found = false;
        for (let x = 0; x < imgWidth; x++) {
            let currPixelIndex = (y * imgWidth + x);
            if (img[currPixelIndex] != 0) {
                borders.push(Math.min(y + 1, imgHeight));
                found = true;
                break;
            }
        }
        if (found) break;
    }

    return borders;
}


function toInputFormat(imgPixels, img) {
    let borders = getImgBorders(imgPixels, mainCanvas.height, mainCanvas.width);
    //left, right, top, bottom

    let placeForDigitWidth = borders[1] - borders[0];
    let placeForDigitHeight = borders[3] - borders[2];

    // Добавляем паддинги по 7 пикселей с каждой стороны, чтобы подогнать под датасет инпут
    //ориг ДС - 28x28 и прим. 20x20 - обл. рисования
    //50х50 => прим. 36x36 - обл рисования
    const padding = 7;

    // Очищаем второй канвас перед отрисовкой
    secondContext.clearRect(0, 0, secondCanvas.width, secondCanvas.height);

    // Вычисляем масштаб и размеры для отрисовки на втором канвасе
    const scale = Math.min(
        (secondCanvas.width - padding * 2) / placeForDigitWidth,
        (secondCanvas.height - padding * 2) / placeForDigitHeight
    );
    const scaledWidth = placeForDigitWidth * scale;
    const scaledHeight = placeForDigitHeight * scale;

    // Вычисляем позиция для отрисовки по центру
    const x = (secondCanvas.width - scaledWidth) / 2;
    const y = (secondCanvas.height - scaledHeight) / 2;

    // Отрисовываем цифру на втором канвасе
    secondContext.drawImage(
        img,
        borders[0],
        borders[2],
        placeForDigitWidth,
        placeForDigitHeight,
        x,
        y,
        scaledWidth,
        scaledHeight
    );

    return toOneDemencityGrayscaleArray(secondContext.getImageData(0, 0, secondCanvas.width, secondCanvas.height).data, 50);
}
async function getAndScaleImport() {
    return new Promise((resolve) => {
        let img = new Image();
        img.src = mainCanvas.toDataURL();

        img.onload = () => {
            let imagePixels = mainContext.getImageData(0, 0, mainCanvas.width, mainCanvas.height).data;
            let correctInputImgPixels = toInputFormat(toOneDemencityGrayscaleArray(imagePixels, mainCanvas.width), img);
            resolve(correctInputImgPixels);
        }
    });
}

function getResult(prob) {
    let digit = 0;
    let maxProb = -1;

    for (let i = 0; i < prob.length; i++) {
        if (maxProb < prob[i]) {
            maxProb = prob[i];
            digit = i;
        }
    }

    return digit;
}

function runNeuralNetwork(data) {
    fowardPropagation(data)
        .then(input => {
            fetchOutputValue.innerHTML = (getResult(input));
        })
}