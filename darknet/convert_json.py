import json
import os

class j():
    '''
    Преобразование нескольких json файлов darknet
    в один json coco файл
    '''
    def __init__(self):
        self.images = 1
        self.annotation= 1
        self.json_out = {'images':[], 'annotations':[]}

    def add(self, jsonfile):
        with open(jsonfile) as json_file:
            data = json.load(json_file)
            path, filename = os.path.split(data[0]['filename'])
            self.json_out['images'].append({
                'id': self.images,
                'file_name': filename
            })
            if len(data[0]['objects'])>0:
                for obj in data[0]['objects']:
                    x = round(float(obj["relative_coordinates"]["center_x"] - obj["relative_coordinates"]["width"]/2)* 1919, 2)
                    y = round(float(obj["relative_coordinates"]["center_y"] - obj["relative_coordinates"]["height"]/2) * 1079, 2)
                    w = round(float(obj["relative_coordinates"]["width"]) * 1919, 2)
                    h = round(float(obj["relative_coordinates"]["height"]) * 1079, 2)
                    if (x + w) >= 1920:
                        w = 1920 - x - 1

                    if (y + h) >= 1080:
                        h = 1080 - y - 1

                    if x < 0:
                        x = 0

                    if y < 0:
                        y = 0

                    self.json_out['annotations'].append({
                        'id': self.annotation,
                        'image_id': self.images,
                        "category_id": 1,
                        "bbox": [x, y, w, h]
                    })
                    self.annotation += 1
            self.images += 1

    def result(self):
        return self.json_out
