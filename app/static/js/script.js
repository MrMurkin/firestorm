const rand = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));
const lamp = document.getElementsByClassName('lamp')[0];

function changeLamp(light){
    lamp.className = `lamp ${light}`
}

function setRandomLight(){
    changeLamp(['red-light', 'green-light'][rand(0, 1)]);
}

setInterval(setRandomLight, 5000);

$('.normal-image').draggable({cursor: 'move'});

let zoom = 100;

document.getElementsByClassName('image-container')[0].onwheel =  function(e){
    if(zoom < 1000){
        zoom += (e.deltaY/-1000)*200;
        document.getElementsByClassName('info-zoom')[0].innerHTML = `${zoom.toFixed(2)}%`
    }
    document.getElementsByClassName('normal-image')[0].style.width = `${zoom}%`;
    document.getElementsByClassName('normal-image')[0].style.height = `${zoom}%`;
}

function zoomIn(){
    if(zoom < 1000){
        zoom += 20;
        document.getElementsByClassName('info-zoom')[0].innerHTML = `${zoom.toFixed(2)}%`
    }
    document.getElementsByClassName('normal-image')[0].style.height = `${zoom}%`;
    document.getElementsByClassName('normal-image')[0].style.width = `${zoom}%`;
}

function zoomOut(){
    if(zoom > 20){
        zoom -= 20;
        document.getElementsByClassName('info-zoom')[0].innerHTML = `${zoom.toFixed(2)}%`
    }
    document.getElementsByClassName('normal-image')[0].style.height = `${zoom}%`;
    document.getElementsByClassName('normal-image')[0].style.width = `${zoom}%`;
    
}

function openNextImage(){
    if(document.getElementsByClassName('file')[openedFileIndex + 1]){
        document.getElementsByClassName('file')[openedFileIndex + 1].click();
    } else {
        document.getElementsByClassName('file')[0].click();
    }
}

function openPrevImage(){
    if(document.getElementsByClassName('file')[openedFileIndex - 1]){
        document.getElementsByClassName('file')[openedFileIndex - 1].click();
    } else {
        document.getElementsByClassName('file')[ document.getElementsByClassName('file').length-1].click();
    }
}

function changeFileType(type){
    if(type == 'block'){


        document.getElementsByClassName('block-button')[0].style.opacity = '1';
        document.getElementsByClassName('block-button')[1].style.opacity = '0.3';

        for(let i = 0; i < document.getElementsByClassName('file').length; i++){
            document.getElementsByClassName('file')[i].classList.remove('flat-file');
        }

    } else {
        document.getElementsByClassName('block-button')[0].style.opacity = '0.3';
        document.getElementsByClassName('block-button')[1].style.opacity = '1';

        for(let i = 0; i < document.getElementsByClassName('file').length; i++){
            document.getElementsByClassName('file')[i].classList.add('flat-file');
        }
    }
}