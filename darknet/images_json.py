import os
import subprocess
from convert_json import j
import json

json_cl = j()

for root, dirs, files in os.walk('./images'):
    files = sorted(files, reverse = True)
    os.system('echo {}'.format(files))
    for x, filename in enumerate(files):
        bashCommand = "darknet detector test data/coco.data yolov3_findpeaple.cfg yolov3_findpeaple_last.weights {} -ext_output -dont_show -out result.json".format(filename)
        process = subprocess.Popen(bashCommand.split(), stdout=subprocess.PIPE)
        output, error = process.communicate()
        json_cl.add('./result.json')
        
with open('coco_json.json','w') as outfile:
    json.dump(json_cl.result(), outfile)
    

