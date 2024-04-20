import numpy as np
import pandas as pd
from PIL import Image
import os

def pngToGrayscaleResize(imagePath):
    img = Image.open(imagePath)
    imgGrayscale = img.convert('L')
    imgResized = imgGrayscale.resize((50, 50))
    imgArray = np.array(imgResized)
    imgArray = 255 - imgArray
    imgFlatten = imgArray.flatten()
    return imgFlatten

def convertToCsv(inputFolder, outputCsv):
    imageFiles = os.listdir(inputFolder)
    data = []

    for imageFile in imageFiles:
        if imageFile.endswith(".png"):
            imagePath = os.path.join(inputFolder, imageFile)
            imgData = pngToGrayscaleResize(imagePath)
            imgData = np.insert(imgData, 0, int(9))
            data.append(imgData)

    df = pd.DataFrame(data)
    df.to_csv(outputCsv, index=False, header=False)


if __name__ == '__main__':
    convertToCsv("nines", "dsNines.csv")

    oldDataset = 'train.csv'

    additDataset = 'dsNines.csv'
    additDatasetData = pd.read_csv(additDataset)

    additDataset.to_csv(oldDataset, mode='a', index=False, header=False)
