Докер контейнер основан на образе https://hub.docker.com/r/daisukekobayashi/darknet. Используется контейнер c OPENCV для GPU NVIDIA Titan.


Для видеокарты другой серии необходимо изменить тег.
"FROM daisukekobayashi/darknet:gpu-cv-cc86" - образ для RTX 30-ой серии.
"gpu-cv-cc75" для RTX 20-ой серии.

Для создания образа (во время разработки): docker build -t firestorm . 

Для запуска образа: docker run -p 81:80 firestorm

Проще всего запустить docker-compose build, затем up.

Доступные теги: https://hub.docker.com/r/daisukekobayashi/darknet/tags

Узнать нужный тег: https://developer.nvidia.com/cuda-gpus

Для обучения модели запустить скрипт ./darknet/train. Снимки для обучения должны лежать в папке ./darknet/annotations/data

Для предсказания тестовой (приватной) выборки запустить скрипт ./darknet/predict. Изображения должны быть в папке ./darknet/images

Конфигурационный файл загружать в ./darknet/yolov3_findpeaple.cfg

Веса загружать в ./darknet/yolov3_findpeaple_last.weights

Ссылка на веса: https://disk.yandex.ru/d/qwRAchzFe9MXmQ

Интерфейс для определения человека в опасной зоне на web http://0.0.0.0:81

Опасная зона отмечается точками контура и при пересечении площади опасной зоны с прямоугольником человека появляется модальное окно "человек в опасной зоне".
