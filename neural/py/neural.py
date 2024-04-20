import random
import numpy as np
from typing import List
import json

from preprocess_utils import getTrainingData

#референсы :
#https://www.susu.ru/sites/default/files/laboratornaya_rabota.pdf
# https://www.youtube.com/watch?v=gBYQWvz13Ds

class NeuralNetwork:
    weights: List[np.ndarray]
    biases: List[np.ndarray]
    layerSizes: List[int]
    layersNum: int

    def __init__(self, layerSizes):
        self.layerSizes = layerSizes
        self.layersNum = len(layerSizes)
        self.biases = [np.random.randn(y, 1) for y in layerSizes[1:]]  #начальная инициализация весов, смещений
        self.weights = [np.random.randn(y, x) for x, y in zip(layerSizes[:-1], layerSizes[1:])]

    #подсчет выходных сигналов сети при конкретных входных сигналах
    def fowardPropagation(self, a: np.ndarray):
        for weight, bias in zip(self.weights, self.biases):
            z = np.dot(weight, a) + bias
            a = self.sigmoid(z)
        return a

    #Стохастический градиентный спуск(обучаем по рандомным выборкам определенного размера)
    def StochasticGradientDescent(self, trainingData, epochs, batchSize, learnRate, testData):
        trainingDataLength = len(trainingData)
        testDataLength = len(testData)
        for epoch in range(epochs):
            random.shuffle(trainingData)
            for i in range(0, trainingDataLength, batchSize):
                #на каждой выборке обновляем веса, далее подсчитываем потери на конкретной выборке
                self.updateBatch(trainingData[i:i + batchSize], learnRate)
                print("Epoch " + str(epoch) + "iter: " + str(i) + " lose: " + " " + str(1.0 - self.evaluate(trainingData[i:i + batchSize]) / batchSize))
            random.shuffle(testData)
            #в конце эпохи проводим тестирование текущих параметров на тестируюющей выборке из 10к тестов
            percentile = self.evaluate(testData) / testDataLength
            print('Epoch comp: ' + str(epoch) + ', Percentile: ' + str(percentile * 100))

    def updateBatch(self, batch, learningRate):
        #списки сумм градиентов dC/dW(B) для дальнейшего заполнения
        weightGradients = [np.zeros(weight.shape) for weight in self.weights]
        biasGradients = [np.zeros(bias.shape) for bias in self.biases]

        for test, answer in batch:
            #Вычисления градиентов для каждого теста из сформированной выборки
            deltaGradientBiases, deltaGradientWeights = self.backpropagate(test, answer)

            #суммирование градиентов для текущего случая с суммой предыдущих случаев
            biasGradients = [gb + dgb for gb, dgb in zip(biasGradients, deltaGradientBiases)]
            weightGradients = [gw + dgw for gw, dgw in zip(weightGradients, deltaGradientWeights)]

        #обновление весов и смещений нейронки согласно формуле w(new) = w(old) - LR * dW
        self.weights = [weight - (learningRate) * gw for weight, gw in zip(self.weights, weightGradients)]
        self.biases = [bias - (learningRate) * gb for bias, gb in zip(self.biases, biasGradients)]

    #обратное распространение
    def backpropagate(self, inputNeuronsActivation, answer):
        #cписки градиентов dc/dw(b)
        weightGradients = [np.zeros(weight.shape) for weight in self.weights]
        biasGradients = [np.zeros(bias.shape) for bias in self.biases]

        #список выходных сигналов слоев
        #изначально в списке сигналы первого слоя
        activation = inputNeuronsActivation
        activations = [inputNeuronsActivation]

        #прямое распространение
        activatePotentials = []
        for bias, weight in zip(self.biases, self.weights):
            currentLayerPotential = np.dot(weight, activation) + bias

            activatePotentials.append(currentLayerPotential)

            activation = self.sigmoid(currentLayerPotential)  #подсчет выходных сигналов текущего слоя через сигмоиду
            activations.append(activation)

        #подсчет меры влияния выходного слоя на ошибку
        delta = self.costDeriv(activations[-1], answer) * self.sigmoidDeriv(activatePotentials[-1])

        #dc/dw градиенты для выходного слоя
        weightGradients[-1] = np.dot(delta, activations[-2].transpose())

        #подсчет градиентов для оставшихся слоев начиная с предпоследнего
        for i in range(2, self.layersNum):
            activationPotential = activatePotentials[-i]
            sd = self.sigmoidDeriv(activationPotential)
            delta = np.dot(self.weights[-i + 1].transpose(), delta) * sd

            biasGradients[-i] = delta
            weightGradients[-i] = np.dot(delta, activations[-i - 1].transpose())

        return biasGradients, weightGradients

    #подсчет сколько нейронная сеть угадала тестов из тестирующей выборки
    def evaluate(self, testData):
        test_results = [(self.fowardPropagation(x), y) for (x, y) in testData]
        return sum(np.array_equal(np.argmax(x), np.argmax(y)) for (x, y) in test_results)

    #сигмоида
    @staticmethod
    def sigmoid(z):
        r = 1.0 / (1.0 + np.exp(-z))
        return r

    #производная сигмоиды
    @staticmethod
    def sigmoidDeriv(z: np.ndarray):
        s = NeuralNetwork.sigmoid(z)
        return s * (1.0 - s)

    #вычисления вектора частных производных функции стоимости
    def costDeriv(self, outputActivations, y):
        return (outputActivations - y)


if __name__ == '__main__':
    print("Preprocess dataset started.")
    testData, trainingData = getTrainingData()
    print("Preprocess dataset ended. Start training..")

    neuralNetwork = NeuralNetwork([2500, 100, 10])
    neuralNetwork.StochasticGradientDescent(trainingData, 23, 10, 0.5, testData)

    #запись матрицы весов, смещений в json
    jsonOutputData = json.dumps({"w": [neuralNetwork.weights[i].tolist() for i in range(2)],
                                 "b": [neuralNetwork.biases[i].tolist() for i in range(2)]}, ensure_ascii=False)
    with open("weights.json", 'w') as f:
        f.write(jsonOutputData)
