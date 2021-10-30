const calendarContainer = document.getElementsByClassName('calendar-body-row')[1];
let stringDate = "2021-10-12T09:13:26";
let date = new Date(stringDate);
const myDate = {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
};

const rusMounths = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь"
];

document.getElementsByClassName('calendar-month')[0].innerText = rusMounths[myDate.month];

function getDay(date){
    let day = date.getDay();
    if(day == 0){
        day = 7;
    } 
    return day - 1;
}

function createCalendar(container, year, month, today){
    let mon = month;
    let date = new Date(year, mon);
    container.innerHTML = '';

    for (let i = 0; i < getDay(date); i++){
        let emptyCalendarCell = document.createElement('div');
        emptyCalendarCell.className = 'calendar-cell-week';

        container.appendChild(emptyCalendarCell);
    }

    while (date.getMonth() == mon) {
        let calendarCell = document.createElement('div');
        calendarCell.className = 'calendar-cell';
        calendarCell.innerHTML = date.getDate();

        container.appendChild(calendarCell);

        date.setDate(date.getDate() + 1);
    }

    // for(let i = 0 ; i < container.childNodes.length; i++){
    //     let stringDate = `${year}${(month + '').length == 1 ? '0' + (month+1) : (month+1)}${container.childNodes[i].innerHTML.length == 1 ? '0' + container.childNodes[i].innerHTML: container.childNodes[i].innerHTML}`;
    //     for(let j = 0; j < statisticDate.length; j++){
    //         if(statisticDate[j][0][0].split('-')[0] == stringDate){
    //             if(statisticDate[j][2] + statisticDate[j][1] == 0){
    //                 container.childNodes[i].classList.add('checked');
    //             }
    //         }
    //     }
    // }
    let createChecked = setInterval(()=>{
        //console.log(statisticDate);
        if(statisticDate){

            for(let j = 0; j < statisticDate.length; j++){
                for(let i = 0; i < container.childNodes.length; i++){
                    let stringDate = `${year}${(month + '').length == 1 ? '0' + (month+1) : (month+1)}${container.childNodes[i].innerHTML.length == 1 ? '0' + container.childNodes[i].innerHTML: container.childNodes[i].innerHTML}`;
                    if(statisticDate[j][0][0].split('-')[0] == stringDate){
                        if(statisticDate[j][1] + statisticDate[j][2] > 0){
                            container.childNodes[i].classList.add('checked');
                        }
                    }
                }
            }

            clearInterval(createChecked);
        }
    }, 100);
    

    for(let i = 0; i < container.childNodes.length; i++){
        if(myDate.month <= new Date(stringDate).getMonth() || myDate.year < new Date(stringDate).getFullYear()){
            if(myDate.month == new Date(stringDate).getMonth()){
                if(container.childNodes[i].innerHTML <= today || myDate.year < new Date(stringDate).getFullYear()){
                    container.childNodes[i].onclick = function(){
                        let stringDate = `${year}${(month + '').length == 1 ? '0' + (month+1) : (month+1)}${container.childNodes[i].innerHTML.length == 1 ? '0' + container.childNodes[i].innerHTML: container.childNodes[i].innerHTML}`;
                        sendDate(stringDate);

                        document.getElementById('red-strip').style.boxShadow = 'none';
                        document.getElementById('yellow-strip').style.boxShadow = 'none';
                        
                        for(let j = 0; j < statisticDate.length; j++){
                            if(statisticDate[j][0][0].split('-')[0] == stringDate){
                                document.getElementById('red-strip').style.boxShadow = `${(document.getElementById('red-strip').offsetWidth/10)*statisticDate[j][1] > document.getElementById('red-strip').offsetWidth ? document.getElementById('red-strip').offsetWidth : (document.getElementById('red-strip').offsetWidth/10)*statisticDate[j][1]}px 0px 0px  rgb(255, 0, 64) inset`;
                                document.getElementById('yellow-strip').style.boxShadow = `${(document.getElementById('yellow-strip').offsetWidth/10)*statisticDate[j][2]}px 0px 0px  rgb(255, 187, 0) inset`;
                                //console.log(statisticDate[j])
                            }
                        }
                        
                        for(let j = 0; j < container.childNodes.length; j++){
                            container.childNodes[j].style.background = 'none';
                        }
                        this.style.background = '#2962ff60';
                    }
                } 
            } else {
                container.childNodes[i].onclick = function(){
                    let stringDate = `${year}${(month + '').length == 1 ? '0' + (month+1) : (month+1)}${container.childNodes[i].innerHTML.length == 1 ? '0' + container.childNodes[i].innerHTML: container.childNodes[i].innerHTML}`;
                    sendDate(stringDate);

                    document.getElementById('red-strip').style.boxShadow = 'none';
                    document.getElementById('yellow-strip').style.boxShadow = 'none';
                    
                    for(let j = 0; j < statisticDate.length; j++){
                        if(statisticDate[j][0][0].split('-')[0] == stringDate){
                            document.getElementById('red-strip').style.boxShadow = `${(document.getElementById('red-strip').offsetWidth/10)*statisticDate[j][1] > document.getElementById('red-strip').offsetWidth ? document.getElementById('red-strip').offsetWidth : (document.getElementById('red-strip').offsetWidth/10)*statisticDate[j][1]}px 0px 0px  rgb(255, 0, 64) inset`;
                            document.getElementById('yellow-strip').style.boxShadow = `${(document.getElementById('yellow-strip').offsetWidth/10)*statisticDate[j][2]}px 0px 0px  rgb(255, 187, 0) inset`;
                            //console.log(statisticDate[j])
                        }
                    }
                    
                    for(let j = 0; j < container.childNodes.length; j++){
                        container.childNodes[j].style.background = 'none';
                    }
                    this.style.background = '#2962ff60';
                }
            }
        }

        if(container.childNodes[i].innerHTML == today && myDate.month == new Date(stringDate).getMonth() && myDate.year >= new Date(stringDate).getFullYear()){
            container.childNodes[i].classList.add('today');
        }
        
        if(myDate.month >= new Date(stringDate).getMonth() && container.childNodes[i].innerHTML > today && myDate.year >= new Date(stringDate).getFullYear()) {
            container.childNodes[i].classList.add('tomorrow');
        }

        if(myDate.month > new Date(stringDate).getMonth() && myDate.year >= new Date(stringDate).getFullYear()){
            container.childNodes[i].classList.add('tomorrow');
        }

        if(myDate.year > new Date(stringDate).getFullYear()){
            container.childNodes[i].classList.add('tomorrow');
        }
    }
}

function prevMonth(){
    myDate.month -= 1;
    if(myDate.month < 0){
        myDate.month = 11;
        myDate.year-=1;
    }
    createCalendar(calendarContainer, myDate.year, myDate.month, myDate.day);
    document.getElementsByClassName('calendar-month')[0].innerHTML = rusMounths[myDate.month];
    document.getElementsByClassName('calendar-year')[0].innerHTML = myDate.year;
}

function nextMonth(){
    myDate.month += 1;
    if(myDate.month > 11){
        myDate.month = 0;
        myDate.year+=1;
    }
    createCalendar(calendarContainer, myDate.year, myDate.month, myDate.day);
    document.getElementsByClassName('calendar-month')[0].innerHTML = rusMounths[myDate.month];
    document.getElementsByClassName('calendar-year')[0].innerHTML = myDate.year;
}

$(document).ready(function(){
    setTimeout(
        () => {
            sendDate(`${myDate.year}${(myDate.month+1) < 10 ? '0' + (myDate.month+1) : (myDate.month+1)}${myDate.day < 10 ? '0' + myDate.day : myDate.day}`);
        }, 700
    )
});