let ws;
let openedFileIndex = -1;
let gradientHighArray = [];
$(document).ready(function() {   
    if (!window.WebSocket) {
        if (window.MozWebSocket) {
            window.WebSocket = window.MozWebSocket;
        } else {
          alert("Ваш браузер не обновлялся много лет. Поддерживаются браузеры: Opera, Firefox, Chrome, Safari, YandexBrowser")
        }
    }
    ws = new WebSocket('ws://'+document.domain+":"+location.port+'/MinersImages');
    // ws.binaryType = "arraybuffer";
    ws.onopen = function(evt) {
        console.log('Успешное подключение к серверу');
    };
    ws.onclose = function() {
        console.log("Отключение от сервера");
    };
    ws.onerror = function(e) {
        console.log("Ошибка соединения по websocket", e.msg);
    }
    ws.onmessage = function(evt) {
        if(evt.data != ""){
	    //console.log(evt.data)
            message = JSON.parse(evt.data);
            console.log(message)
            switch (message.message){
                case 'images':
                    images = message.images;
                    names = message.names;
                    insertImages();
                    break;
                case 'signals':
                    console.log('signals',message)
                    messages = message.signals;
                    showMessages(showedMessages, messages);
                    break;
                case 'filesInfo':
                    getFilesInfo(message.filesInfo);
                    break;
                case 'confImage':                    
                    var ctx = document.getElementById("cnv").getContext('2d');                    
                    image.onload = function() {
                        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, 720, 576);
                        drawDots(cords)
                    };
                    image.src = "data:image/png;base64, " + message.image
                    break;
            }
        }
    }   
    function getFilesInfo(filesInfo){
        // console.log('filesInfo',filesInfo); 
        statisticDate = filesInfo;
    } 
    function insertImages(){
        let previewContainer = document.querySelector('.preview-container');
        previewContainer.innerHTML = ""
        for (let index = 0; index < images.length; index++) {
            let file = document.createElement('div');
            let img = document.createElement('img');
            let filename = document.createElement('div');
            file.className="file";
            filename.innerHTML = names[index];
            filename.className="file-name";
            img.src='data:image/png;base64,'+images[index];  
            //document.getElementsByClassName('info')[0].innerHTML = `${names[index]}`;       
            file.appendChild(img);
            file.appendChild(filename);
            file.onclick = function(e){
                openedFileIndex = index;
                document.getElementsByClassName('blured-image')[0].style.backgroundImage = 'url(data:image/png;base64,' + images[index] + ')';  
                document.getElementsByClassName('normal-image')[0].style.backgroundImage = 'url(data:image/png;base64,' + images[index] + ')';  
                zoom = 100;
                document.getElementsByClassName('normal-image')[0].style.width = `${zoom}%`;
                document.getElementsByClassName('normal-image')[0].style.height = `${zoom}%`;

                document.getElementsByClassName('normal-image')[0].style.left = `0%`;
                document.getElementsByClassName('normal-image')[0].style.top = `0%`;

                let bubble = document.createElement('div');
                bubble.className = 'bubble';
                bubble.style.left = e.offsetX + 'px';
                bubble.style.top = e.offsetY + 'px';
                
                file.appendChild(bubble);

                for(let i = 0; i < document.getElementsByClassName('file').length; i++){
                    document.getElementsByClassName('file')[i].style.background = 'none';
                }

                setTimeout(() => {
                    for(let i = 0; i < document.getElementsByClassName('file').length; i++){
                        document.getElementsByClassName('file')[i].style.background = 'none';
                    }
                    file.style.background = '#2962ff60';
                }, 200);

                setTimeout(() => {
                    file.removeChild(bubble);
                }, 1000);
            }
            
            previewContainer.appendChild(file);
        }      
        if(images.length < 1){
            document.getElementsByClassName('preview-container')[0].style.backgroundImage = '{{ url_for("static", path="icons/no-photo.png") }}';
            document.getElementsByClassName('preview-container')[0].style.opacity = '0.3';

            document.getElementsByClassName('normal-image')[0].style.backgroundImage = 'none';  
            document.getElementsByClassName('blured-image')[0].style.backgroundImage = 'none';  

            for(let i = 0; i < document.getElementsByClassName('image-hover-button').length; i++){
                document.getElementsByClassName('image-hover-button')[i].classList.add('disabled-hover-button');
            }
        } else {
            document.getElementsByClassName('preview-container')[0].style.backgroundImage = 'none';
            document.getElementsByClassName('preview-container')[0].style.opacity = '1';

            document.getElementsByClassName('normal-image')[0].style.backgroundImage = 'none';  
            document.getElementsByClassName('blured-image')[0].style.backgroundImage = 'none';  

            for(let i = 0; i < document.getElementsByClassName('image-hover-button').length; i++){
                document.getElementsByClassName('image-hover-button')[i].classList.remove('disabled-hover-button');
            }
        }
    }

    //createCalendar(calendarContainer, myDate.year, myDate.month, myDate.day);

});
let image = new Image();
function sendDate(date){
    images = [];

    let blockName = document.getElementsByClassName('block-name')[0];
    let dd = `${date[date.length-2]}${date[date.length-1]}`;
    let mm = `${date[date.length-4]}${date[date.length-3]}`;
    let yy = `${date[0]}${date[1]}${date[2]}${date[3]}`;
    blockName.innerHTML = dd + '/' + mm + '/' + yy;    

    let message = {
        message: 'getImages',
        date: date
    }
    ws.send(JSON.stringify(message));
}

let images = [];
let names = [];
let statisticDate;
let messages;
let data;


class Datas {
    constructor(){

    }
    sendDatas(fileInput, route){
        let formData = new FormData();
        formData.append('file', fileInput.files[0])
        let request = new XMLHttpRequest();
        request.responseType = 'blob'
        request.onload = function (e) {
            var blob = e.currentTarget.response;
            saveBlob(blob,'result.jpg')
        }
        request.open("POST", route)
        request.send(formData)
        console.log('send')
    }
    
}
function saveBlob(blob, fileName) {
    var a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    a.dispatchEvent(new MouseEvent('click'));
    setBackground(blob)
}

function setBackground(blob) {
    console.log(document.querySelector('.glass-container'))
    let url = URL.createObjectURL(blob)
    document.querySelector('.glass-container').src = url;
}


data = new Datas()
