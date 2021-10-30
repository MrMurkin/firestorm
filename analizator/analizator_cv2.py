import numpy as np
import cv2 as cv
import json
import matplotlib.pyplot as plt

class mineman_analizator():

    def __init__(self, img ,path = '../data/config/config.txt', blur=(20,20)):
        '''
        path - путь до файла с координатами
        blur - кортеж с уровнем размытия
        img - numpy массив изображения с камеры
        '''
        self.blur = blur
        #формирование маски
        self.mask = self.create_mask(path, img)

    def create_mask(self, path, img):
        #чтение координат из файла
        figure = open(path)
        figure = json.loads(figure.read())
        figure = figure.get('cords')

        #создание маски по размерам кадра и координатам
        canvas = np.zeros((img.shape[0], img.shape[1]), np.uint8)
        cv.polylines(canvas, np.array([figure],np.int32), False, (255,255,255), 1)
        cv.fillPoly(canvas, np.array([figure],np.int32), (255,255,255))
        canvas = cv.imread('./mask/mask.png')###!
        canvas = canvas[:,:,1]###!
        return canvas

    def analysis(self, img):
        #блюр и трешхолд для избавления от выбросов
        blur_img = cv.blur(img[:,:,2],self.blur)
        dot = img.copy()
        ret, blur_img = cv.threshold(blur_img, 155, 255, 0, cv.THRESH_BINARY)
        #проверка есть ли объект на изображении
        if np.sum(blur_img == 255) != 0:
            #поиск % объекта на маске
            diff = np.sum(self.mask > blur_img)#разница между маской и объектом
            total_mask = np.sum(self.mask >= 255)#сколько 255 пикселей на маске
            man_mask = np.sum(blur_img >= 255)#сколько 255 пикселей у объекта
            percentage = ((total_mask-diff)/man_mask)*100#сколько % объекта на конвейере
            if percentage >= 50.0:###?
                plt.subplot(121),plt.imshow(self.mask),plt.title('mask')
                plt.xticks([]), plt.yticks([])
                plt.subplot(122),plt.imshow(dot),plt.title('stop 1')
                plt.show()
                return True
            elif percentage >= 3.0 and percentage < 50.0:
                #поиск центра объекта
                contours, im2 = cv.findContours(blur_img,cv.RETR_TREE,cv.CHAIN_APPROX_SIMPLE)
                for c in contours:
                    M = cv.moments(c)
                    if M["m00"] != 0:
                        xy = [int(M["m10"] / M["m00"]),int(M["m01"] / M["m00"])]
                    else:
                        xy = [0,0]
                    cv.circle(dot, (xy[0], xy[1]), 5, (255, 255, 255), -1)###!

                    #поиск нижней точки объекта
                    area = blur_img[int(xy[1]), :].sum()
                    sdvig = (area/255)//2
                    for j in blur_img[int(xy[1]): , int(xy[0]-sdvig):int(xy[0]+sdvig)]:
                        if j.sum() == 0:
                            cv.circle(dot, (int(xy[0]), int(xy[1])), 5, (255, 200, 15), -1)###!
                            break
                        xy[1]+=1
                        if xy[1] == self.mask.shape[0]:
                            xy[1] = self.mask.shape[0]-1
                            cv.circle(dot, (int(xy[0]), int(xy[1])), 5, (255, 200, 15), -1)###!
                            break
                    #если нижняя точка объекта находится в опасной зоне
                    if self.mask[int(xy[1]), int(xy[0])] == 255:
                        plt.subplot(121),plt.imshow(self.mask),plt.title('mask')
                        plt.xticks([]), plt.yticks([])
                        plt.subplot(122),plt.imshow(dot),plt.title('stop 2')
                        plt.show()
                        return True
            else:
                plt.subplot(121),plt.imshow(self.mask),plt.title('mask')
                plt.xticks([]), plt.yticks([])
                plt.subplot(122),plt.imshow(dot),plt.title('ok 1')
                plt.show()
                return False

# # класс принимает на вход numpy array кадра, путь до координат маски и уровень размытия
# img = cv.imread('./conv/{}.png'.format('535'))
# path = './data_config_config.txt'
# # path = '../data/config/config.txt'
# m = mineman_analizator(img, path, (25,25))#массив, путь и уровень размытия
# for i in range(0,1000):
#     img = cv.imread('./conv/{}.png'.format(i))
#     status = m.analysis(img)#возвращает True в случае, если челoвек на конвейере или False в случае если человека нет на конвейере
