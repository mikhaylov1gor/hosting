import numpy as np
import pandas as pd
from PIL import Image

def resize(path, output):
    ds = pd.read_csv(path)

    resized = []

    for index, row in ds.iterrows():
        answer = row[0]
        image = np.array(row[1:], dtype=np.uint8).reshape(28, 28)
        image = Image.fromarray(image)
        image = image.resize((50, 50))
        image_array = np.array(image, dtype=np.uint8).flatten()
        resized.append(np.concatenate([[answer], image_array]))

    resized_df = pd.DataFrame(resized)
    resized_df.to_csv(output, index=False, header=False)

if __name__ == '__main__':
    resize("mnist_train.csv", "train.csv")
    resize("mnist_test.csv", "test.csv")