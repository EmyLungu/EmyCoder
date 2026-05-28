import numpy as np
import albumentations as A
from pathlib import Path
from trainer.loader import read_df
import matplotlib.pyplot as plt
from PIL import Image, ImageDraw, ImageFont

# import pandas as pd

BASE_DIR = Path(__file__).resolve().parent


def get_windows(content: str, window_size=30, stride=15):
    """
    Transform the content (of a file) into a
    list of snippets of given size
    """

    lines = content.splitlines()

    snippets = []
    for i in range(0, len(lines) - window_size + 1, stride):
        window = lines[i:i + window_size]

        if len("".join(window).strip()) > 50:
            snippets.append("\n".join(window))
    return snippets


def create_image(snippet) -> np.array:
    height, width = 512, 512

    pil_img = Image.new("RGB", (width, height), color=(0, 0, 0))
    draw = ImageDraw.Draw(pil_img)

    font = ImageFont.load_default(12)
    position = (32, 32)
    text_color = (255, 255, 255)

    draw.text(position, snippet, fill=text_color, font=font)

    return np.array(pil_img)


def main(dataset_name: str) -> list:
    # export_to_parquet(dataset_name, 100)
    df = read_df(dataset_name)

    transform = A.Compose(
        [
            # A.Resize(width=400, height=400),
            # A.HorizontalFlip(p=0.5),  # 50% chance to flip horizontally
            A.RandomBrightnessContrast(p=0.2),
            A.Rotate(limit=10, p=0.2),
        ]
    )

    for file in df["Content"]:

        snippets = get_windows(file)

        image = create_image(snippets[0])

        augmented_image = transform(image=image)["image"]

        plt.imshow(augmented_image)
        plt.axis("off")
        plt.savefig(BASE_DIR / "test1.png", bbox_inches="tight", pad_inches=0)
        plt.close()

        break


if __name__ == "__main__":
    main("cv_sample1")
