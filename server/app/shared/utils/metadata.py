import os
from PIL import Image

def get_size(path):
    return os.path.getsize(path)

def get_dimensions(path):
    with Image.open(path) as img:
        return img.size  # returns (width, height)