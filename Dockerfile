#FROM python:3.9


FROM daisukekobayashi/darknet:gpu-cv-cc86


RUN apt-get update && apt-get install python3 -y


WORKDIR /workspace


RUN apt-get install pip -y


RUN pip install --upgrade pip


COPY ./requirements.txt /workspace/requirements.txt


RUN pip install --no-cache-dir --upgrade -r /workspace/requirements.txt


COPY ./app /workspace/app


#RUN apt-get update && apt-get install -y ffmpeg libglib2.0-0 libxext6 libsm6 libxrender-dev


WORKDIR /workspace


RUN apt-get install ffmpeg libsm6 libxext6  -y


CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80", "--reload"]
