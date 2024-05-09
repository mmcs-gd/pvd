import os
from PIL import Image


def is_directory_with_only_files(path):
    if os.path.isdir(path):
        return all(os.path.isfile(os.path.join(path, name)) for name in os.listdir(path))
    return False


def create_tilemap_for_directory(directory):
    dirs_with_only_files = [
        os.path.join(directory, d) for d in os.listdir(directory)
                            if is_directory_with_only_files(os.path.join(directory, d))]

    dirs_with_only_files.sort()

    rows = []

    for subdir in dirs_with_only_files:
        filenames = [f for f in os.listdir(subdir) if f.endswith(('.png'))]
        filenames.sort()
        images = [
            Image.open(os.path.join(subdir, f)) for f in filenames
        ]
        widths, heights = zip(*(i.size for i in images))
        total_width = sum(widths)
        max_height = max(heights)
        row_image = Image.new('RGBA', (total_width, max_height))
        x_offset = 0
        for img in images:
            row_image.paste(img, (x_offset, 0))
            x_offset += img.width
        rows.append(row_image)

    if rows:
        total_height = sum(img.height for img in rows)
        max_width = max(img.width for img in rows)
        tilemap = Image.new('RGBA', (max_width, total_height))
        y_offset = 0
        for row in rows:
            tilemap.paste(row, (0, y_offset))
            y_offset += row.height
        output_file = os.path.join(directory, 'tilemap.png')
        tilemap.save(output_file)
        print(f'Tilemap creation success: {output_file}')


def spawn_tilemaps(directory):
    for subdir, dirs, files in os.walk(directory):
        if all(is_directory_with_only_files(os.path.join(subdir, d)) for d in dirs):
            create_tilemap_for_directory(subdir)


directory_path = './../src/assets/sprites/pack/Characters'

if __name__ == '__main__':
    spawn_tilemaps(directory_path)
