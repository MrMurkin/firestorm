let cnv = document.getElementById('c');
let ctx = cnv.getContext('2d');

let cords = [];

function createCords(x, y){
    cords.push({
        x: x,
        y: y,
        selected: false,
    });
}

cnv.onclick = function(e){
    let placed = true;
    for(let i = 0; i < cords.length; i++){
        if(cords[i].selected){
            placed = false;
        }
    }

    if(placed){
        createCords(e.offsetX, e.offsetY);
    }


    if(cords.length < 1){
        document.getElementsByClassName('undo-button')[0].style.display = 'none';
    } else {
        document.getElementsByClassName('undo-button')[0].style.display = 'flex';
    }

    if(cords.length >= 3){
        document.getElementsByClassName('done-button')[0].style.display = 'flex';
    } else {
        document.getElementsByClassName('done-button')[0].style.display = 'none';
    }

    return false;
    
}

document.getElementsByClassName('undo-button')[0].onclick = function(){
    cords.pop();
    drawDots(cords);

    if(cords.length < 1){
        document.getElementsByClassName('undo-button')[0].style.display = 'none';
    } else {
        document.getElementsByClassName('undo-button')[0].style.display = 'flex';
    }

    if(cords.length >= 3){
        document.getElementsByClassName('done-button')[0].style.display = 'flex';
    } else {
        document.getElementsByClassName('done-button')[0].style.display = 'none';
    }
}

function drawDots(cords){
    
    ctx.clearRect(0,0,cnv.width,cnv.height);
    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, 720, 576); 

    if(cords.length > 0){
        for(let i = 0; i < cords.length; i++){
            ctx.fillStyle = '#ff0f00';
            ctx.beginPath();
            ctx.arc(cords[i].x, cords[i].y, 4, 0, Math.PI*2, 1);
            ctx.fill();

            ctx.fillStyle = '#ff0f0070';
            ctx.beginPath();
            if(cords[i].selected){
                ctx.arc(cords[i].x, cords[i].y, 10, 0, Math.PI*2, 1);
            } else {
                ctx.arc(cords[i].x, cords[i].y, 5, 0, Math.PI*2, 1);
            }
            ctx.fill();
        }
        
        ctx.beginPath();

        ctx.moveTo(cords[0].x, cords[0].y);
        for(let i = 1; i < cords.length; i++){
            ctx.lineTo(cords[i].x, cords[i].y);
        }
        ctx.fill()
    }
    
}

// drawDots(cords);

let isMouseDown = false;

cnv.onmousedown = function(){
    isMouseDown = true;
}

cnv.onmouseup = function(){
    isMouseDown = false;
}

cnv.onmousemove = function(e){

    cnv.style.cursor = 'default';
    
    for(let i = 0; i < cords.length; i++){
        if( Math.sqrt((e.offsetX - cords[i].x)**2 + (e.offsetY - cords[i].y)**2) < 15 && !isMouseDown){
            for(let j = 0; j < cords.length; j++){
                cords[j].selected = false;
            }  
            cords[i].selected = true;  
            cnv.style.cursor = 'move';
        } else if (Math.sqrt((e.offsetX - cords[i].x)**2 + (e.offsetY - cords[i].y)**2) >= 15 && !isMouseDown) {
            cords[i].selected = false;  
        }

        if(isMouseDown && cords[i].selected){
            cords[i].x = e.offsetX;
            cords[i].y = e.offsetY;
        } 
    }

    drawDots(cords);
}

function getCords(){
    let sendedCords = []; 
    for(let i = 0; i < cords.length; i++){
        sendedCords.push([[cords[i].x * (1920/cnv.width), cords[i].y * (1080/cnv.height)]])
    }   

    let message = {
        message: "cords",
        cords: sendedCords
    }

    alert(sendedCords);
    // ws.send(JSON.stringify(message))
    // return sendedCords
}

document.getElementsByClassName('done-button')[0].onclick = getCords;

function cancelSetting(){
    createCords();
    document.getElementsByClassName('modal-setting')[0].classList.add('closed');
    setTimeout(()=>{
        document.getElementsByClassName('modal-setting')[0].classList.remove('closed');
        document.getElementsByClassName('modal')[0].style.display = 'none';
    }, 400);
}

function openSetting(){
    document.getElementsByClassName('modal')[0].style.display = 'flex';
    msg = {
        'message': 'getConfImage'
    };
    ws.send(JSON.stringify(msg));
}
