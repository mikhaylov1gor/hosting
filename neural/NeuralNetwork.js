function sigmoid(z) {
    return 1.0 / (1.0 + Math.exp(-z));
}

function matrixMulti(matrix, vector) {
    let result = new Array(matrix.length).fill(0.0);
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            result[i] += parseFloat(matrix[i][j]) * parseFloat(vector[j]);
        }
    }
    return result;
}
/*
function transposeMatrix(matrix) {
    let transposed = new Array(matrix[0].length).fill(0.0);
    for (let i = 0; i < matrix[0].length; i++) {
        transposed[i] = new Array(matrix.length);
        for (let j = 0; j < matrix.length; j++) {
            transposed[i][j] = matrix[j][i];
        }
    }
    return transposed;
}
*/
function matrixAdd(a, b) {
    let result = new Array(a.length);
    for (let i = 0; i < a.length; i++) {
        result[i] = parseFloat(a[i]) + parseFloat(b[i]);
    }
    return result;
}

export function fowardPropagation(input) {
    console.log(input)
    let result = input
    return fetch('./weights.json')
        .then(response => response.json())
        .then(data => {
            let weights = data.w;
            let biases = data.b;

            // Проход по слоям нейронной сети
            for (let i = 0; i < weights.length; i++) {

                let z = matrixMulti(weights[i], result);
                z = matrixAdd(z,biases[i]);
                result = z.map(sigmoid);
            }
            return result;
        })
}
