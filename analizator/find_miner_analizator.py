import json
import numpy as np
import cv2 as cv

class Mineman_Analizator():

    def __init__(self, shape, path = '../data/config/config.txt'):
        '''
        path - путь до файла с координатами
        shape - numpy массив изображения с камеры
        '''
        # формирование маски
        self.mask = self.create_mask(path, shape)
        self.prev_id = 0
        self.count_frames = 0

    def create_mask(self, path, shape):
        '''
        Создание маски с выделенной опасной областью
        path - путь до файла с координатами
        shape - numpy массив изображения с камеры
        '''
        # чтение координат из файла
        figure = open(path)
        figure = json.loads(figure.read())
        figure = figure.get('cords')

        # создание маски по размерам кадра и координатам
        canvas = np.zeros((shape[0], shape[1]), np.uint8)
        cv.polylines(canvas, np.array([figure],np.int32), False, (255,255,255), 1)
        cv.fillPoly(canvas, np.array([figure],np.int32), (255,255,255))
        return canvas

    def analysis(self, metadata):
        # есть ли объект в поле зрения камеры
        status = False
        current_id = metadata.get('@timestamp')
        # поиск нижней точки = [x3, y2]
        obj = metadata.get('object')
        bbox = obj.get('bbox')
        topleftx, toplefty = bbox.get('topleftx'), bbox.get('toplefty')
        bottomrightx, bottomrighty = bbox.get('bottomrightx'), bbox.get('bottomrighty')
        midbotx = bottomrightx-(bottomrightx-topleftx)//2
        # проверка: находится ли нижняя точка объекта на маске
        if bottomrighty >= self.mask.shape[0]: bottomrighty = self.mask.shape[0]-1
        if midbotx >= self.mask.shape[1]: midbotx = self.mask.shape[1]-1
        if self.mask[bottomrighty, midbotx] == 255:
            if current_id != self.prev_id:
                self.prev_id = current_id
                self.count_frames+=1
            if self.count_frames >= 10:
                self.count_frames = 0
                status = True
                print('челик на конвейере')
        else: 
            self.count_frames = 0
        return status

# класс принимает на размер кадра, путь до координат маски
mine_analyz = Mineman_Analizator(shape, path_to_config) # размер, путь











