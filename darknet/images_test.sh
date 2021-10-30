#!/bin/bash
for var in $(ls images);
do
    darknet detector test data/coco.data yolov3-tiny_findpeaple.cfg yolov3-tiny_findpeaple_final.weights $var -ext_output -dont_show -out result.json
    
done
   
