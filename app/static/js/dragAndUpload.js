const dropArea = document.getElementById('dragArea');

dropArea.ondragover = function(e){
    e.preventDefault();
    document.getElementsByClassName('upload-button')[0].style.display = 'none';
    document.getElementById('drag-n-text').innerText = '';
    document.getElementById('cloud').style.transform = 'scale(1.7)';
}

dropArea.ondragleave = function(e){
    document.getElementsByClassName('upload-button')[0].style.display = 'block';
    document.getElementById('drag-n-text').innerText = 'Перетащите картинку сюда, или';
    document.getElementById('cloud').style.transform = 'scale(1)';
}

dropArea.ondrop = function(e){
    e.preventDefault();
    alert('Загрузка файла!')
    
}