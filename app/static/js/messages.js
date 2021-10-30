//////КОЛ-ВО ОТОБРАЖАЕМЫХ//////
//                           //
    let showedMessages = 100;//
//                           //
///////////СООБЩЕНИЙ///////////

function showMessages(showedMessages, messages){
    for(let i = 0; i < (showedMessages > messages.length ? messages.length : showedMessages); i++){
        // console.log(i, messages.length)
        let messageBlock = document.createElement('div');
        messageBlock.className = 'message';

        let messageText = document.createElement('div');
        messageText.className = 'message-text';

        let messageTime = document.createElement('div');
        messageTime.className = 'message-time';

        let time = document.createElement('div');
        time.className = 'time';
        time.innerHTML = messages[i].split('-')[1].split(' ')[0]

        let date = document.createElement('div');
        date.className = 'date';
        date.innerHTML = messages[i].split('-')[1].split(' ')[1]

        messageTime.appendChild(time);
        messageTime.appendChild(date);

        messageText.innerHTML = messages[i].split('-')[0];

        messageBlock.appendChild(messageText);
        messageBlock.appendChild(messageTime);

        document.getElementsByClassName('message-container')[0].prepend(messageBlock);
    }
}
