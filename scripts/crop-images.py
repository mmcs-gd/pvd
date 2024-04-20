import cv2
import os
import numpy as np


def find_opaque_bounding_box(images: np.ndarray):
    min_top = np.inf
    min_left = np.inf
    max_bottom = 0
    max_right = 0

    for image in images:
        _, alpha_channel = cv2.threshold(image[:, :, 3], 0, 255, cv2.THRESH_BINARY)
        contours, _ = cv2.findContours(alpha_channel, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        for contour in contours:
            x, y, width, height = cv2.boundingRect(contour)

            top = y
            bottom = y + height
            left = x
            right = x + width

            min_top = min(min_top, top)
            min_left = min(min_left, left)
            max_bottom = max(max_bottom, bottom)
            max_right = max(max_right, right)

    return min_top, max_bottom, min_left, max_right


def crop_images(directory_path: str):
    filenames = os.listdir(directory_path)
    images_map = {
        filename: cv2.imread(
            os.path.join(directory_path, filename), cv2.IMREAD_UNCHANGED
        ) for filename in filenames if filename.endswith('.png')
    }

    if not images_map:
        print('No PNG images found in the directory.')
        return

    top, bottom, left, right = find_opaque_bounding_box(images_map.values())

    for filename, image in images_map.items():
        cropped_image = image[top:bottom, left:right]
        output_path = os.path.join(directory_path, filename)
        cv2.imwrite(output_path, cropped_image)
        print(f'Crop success: {output_path}')


directory_path = './../src/assets/sprites/pack/Characters/'


def crop_images_recursive(directory_path: str):

    for subdir, dirs, files in os.walk(directory_path):
        if all(os.path.isfile(os.path.join(subdir, name)) for name in os.listdir(subdir)):
            crop_images(subdir)


if __name__ == '__main__':
    crop_images_recursive(directory_path)
