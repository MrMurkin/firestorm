from fastapi import FastAPI, WebSocket, Request, BackgroundTasks, WebSocketDisconnect
from fastapi.responses import HTMLResponse, PlainTextResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi import File, UploadFile

import json
import os
#import cv2
import base64
import os
import subprocess

app = FastAPI()

app.mount("/workspace/app/static", StaticFiles(directory='/workspace/app/static'), name='static')

templates = Jinja2Templates(directory='/workspace/app/templates')

signalsFile = '/data/journal/journal.txt'
rabbit_address = 'ai-rabbit'
imagesFiles = '/data/minerImages/'
imagesFiles = '/data/minerImages/'
configFile = '/data/config/config.txt'
videoAddress = 'rtsp://192.168.20.138:554/h264'
jetsonAddress = '192.168.20.137'

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        #message = getLinesFromFile(signalsFile, 'signals')
        #await self.send_personal_message(message, websocket)
        message = getFilesInfo(imagesFiles, 'filesInfo')
        await self.send_personal_message(message, websocket)
        
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        
    async def send_personal_message(self, message, websocket: WebSocket):
        await websocket.send_json(message)
        
    async def broadcast(self, message:str):
        for connection in self.active_connections:
            await connection.send_text(message)

def getLinesFromFile(file, msgType):
    f = open(file, 'r')
    lines = []
    for line in f:
        lines.append(line.split('\\')[0])
    lines.reverse()
    msg = {
        'message': msgType,
        'signals': lines,
    }
    return msg

def getFilesInfo(file, msgType):
    countFiles = 1
    dates = []
    datesArray = []
    h = 0
    l = 0
    for root, dirs, files in os.walk(file):
        files = sorted(files, reverse = True)    
        for x, filename in enumerate(files):        
            if x == 0:
                fileDate = files[0].split('-')[0]
                date = fileDate
                fileTimeDate = files[0].split('_')[0]
                datesArray.append(fileTimeDate)
                countFiles = 1
                fileState = files[0].split('_')[1].split('.')[0]
                if fileState == 'h':
                    h += 1
                else:
                    l += 1
            else:
                fileDate = filename.split('-')[0]
                fileState = filename.split('_')[1].split('.')[0]
                fileTimeDate = filename.split('_')[0]
                if fileDate == date:
                    countFiles += 1
                    datesArray.append(fileTimeDate)
                    if fileState == 'h':
                        h += 1
                    else:
                        l += 1
                else:                                
                    """Запись в общий массив""" 
                    dates.append([datesArray,h,l])
                    h = 0
                    l = 0
                    datesArray = []
                    if fileState == 'h':
                        h += 1
                    else:
                        l += 1
                    date = fileDate              
                    datesArray.append(fileTimeDate)
                    countFiles = 1
    msg = {
        'message': msgType,
        'filesInfo': dates
    }
    return msg

 
manager = ConnectionManager()

@app.post("/uploadImage")
def create_upload_file(file: UploadFile = File(...)):
    print(file.filename)
    with open('/images/{}'.format(file.filename).replace(' ','_'),'wb+') as file_object:
        file_object.write(file.file.read())
        bashCommand = "darknet detector test data/coco.data yolov3_findpeaple.cfg yolov3_findpeaple_last.weights {} -ext_output -dont_show -out result.json".format('/images/{}'.format(file.filename).replace(' ','_'))
        process = subprocess.Popen(bashCommand.split(), stdout=subprocess.PIPE)
    process.wait()
    return FileResponse('predictions.jpg')

@app.get("/")
async def get_main_page(request: Request):
    return templates.TemplateResponse('index.html',{'request':request})

@app.websocket("/MinersImages")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = json.loads(await websocket.receive_text())
            if data['message'] == 'getImages':
                date = data.get('date')
                print("<===== date: "+date+" =====>")
                outImages = []
                fileNames = []
                for root, dirs, files in os.walk(imagesFiles):
                    for filename in files:
                        findFile = filename.split('-')
                        if findFile[0] == date:
                            _, buffer = cv2.imencode('.png', cv2.imread(imagesFiles+filename))
                            pic_str = base64.b64encode(buffer)
                            pic_str = pic_str.decode()
                            outImages.append(pic_str)
                            fileNames.append(filename)
                message = {
                    'message': 'images',
                    'images': outImages,
                    'names': fileNames
                }       
                await manager.send_personal_message(message, websocket)
            if data['message'] == "getConfImage":                                     
                    try:
                        cap = cv2.VideoCapture(videoAddress)   
                        stat, frame = cap.read()
                        _, buffer = cv2.imencode('.png',frame)
                        pic_str = base64.b64encode(buffer)
                        pic_str = pic_str.decode()
                        message = {
                            'message': 'confImage',
                            'image': pic_str,
                        }
                        await manager.send_personal_message(message, websocket)
                        cap.release()
                    except:
                        frame = cv2.imread('./static/images/no-image.png')
                        _, buffer = cv2.imencode('.png',frame)
                        pic_str = base64.b64encode(buffer)
                        pic_str = pic_str.decode()
                        message = {
                            'message': 'confImage',
                            'image': pic_str,
                        }
                        await manager.send_personal_message(message, websocket)
            if data['message'] == "cords":
                print("<===== cords: ", data.get('cords'), " =====>")        
                with open(configFile) as json_file:
                    print('JSON prev', data)
                    cords = {}
                    cords['cords'] = data.get('cords')
                    with open(configFile, 'w') as outfile:
                        print('JSON end', cords)
                        json.dump(cords, outfile)
                print('--restart--')
                os.system('docker restart video_nvds_1')

    except WebSocketDisconnect:
        manager.disconnect(websocket)      




