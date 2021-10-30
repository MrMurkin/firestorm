import json
import numpy as np
import cv2 as cv

class Analysis():

    def __init__(self, limit=0, shape=[1080, 1920], path_to_config = '../data/config/config.txt'):
        '''
        path - путь до файла с координатами
        shape - размер изображения с камеры
        limit - определеяет сколько процентов bbox должны находится в опасной зоной
                чем выше параметр, тем ниже чувствительность
        '''
        self.shape = shape
        self.path_to_config = path_to_config
        self.mask = []
        self.limit = limit

    def get_cords(self):
        '''
        Чтение координат выделенной опасной области
        path - путь до файла с координатами
        '''
        figure = open(self.path_to_config)
        figure = json.loads(figure.read())
        figure = figure.get('cords')
        canvas = self.create_mask(figure)
        return canvas

    def create_mask(self, figure):
        '''
        Создание маски по размерам кадра и координатам опасной зоны
        figure - координаты вершин опасной зоны
        '''
        canvas = np.zeros((self.shape[0], self.shape[1]), np.uint8)
        cv.polylines(canvas, np.array([figure], np.int32), False, (1, 1, 1), 1)
        cv.fillPoly(canvas, np.array([figure], np.int32), (1, 1, 1))
        return canvas

    def find_violation(self, path_to_json):
        '''
        Определение человека в опасной области
        path_to_json - путь до json файла с выходными данными нейронки
        '''
        status = False
        frame = open(path)
        frame = json.load(frame)
        frame = frame[0]
        if len(frame) < 1: return status
        # создание маски
        self.mask = self.get_cords()
        for obj in frame.get('objects'):
            bbox = obj['relative_coordinates']
            # преобразование darknet координат в стандартный bbox
            top_left_x = int((bbox['center_x']-bbox['width']/2)*(self.shape[1]-1))
            top_left_y = int((bbox['center_y']-bbox['height']/2)*(self.shape[0]-1))
            width = int(bbox['width']*(self.shape[1]-1))
            height = int(bbox['height']*(self.shape[0]-1))
            # получение координат вершин ббокс
            four_points_figure = [(top_left_x, top_left_y),
                                (top_left_x+width, top_left_y),
                                (top_left_x+width, top_left_y+height),
                                (top_left_x, top_left_y+height)]
            bbox_mask = self.create_mask(four_points_figure)
            diff = np.sum(self.mask > bbox_mask)# разница между маской и объектом
            total_mask = np.sum(self.mask == 1)# сколько пикселей опасной зоны на маске
            obj_mask = np.sum(bbox_mask == 1)# сколько пикселей объекта
            percentage = ((total_mask-diff)/obj_mask)*100#сколько % ббокса в опасной зоне
            # заданое попадание процента bbox в опасную зону считается нарушением
            print('% = ',percentage)
            if percentage > self.limit:
                status = True
                return status
        return status

# класс принимает на размер кадра, путь до координат маски
shape = [1080, 1920]
path_to_config = './data_config_config.txt'
analyz = Analysis(limit=0, shape=shape, path_to_config=path_to_config) # размер, путь

status = analyz.find_violation('./result.json')
print(status)