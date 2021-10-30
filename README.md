Докер контейнер основан на образе https://hub.docker.com/r/daisukekobayashi/darknet. Используется контейнер c OPENCV для GPU NVIDIA Titan .
Для видеокарты другой серии необходимо изменить tag.
"FROM daisukekobayashi/darknet:gpu-cv-cc86" - образ для RTX 30-ой серии.
"gpu-cv-cc75" для RTX 20-ой серии.
