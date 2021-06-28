const addButton = document.getElementById('add');
const inputTask = document.getElementById('new-task');
const unfinishedTasks = document.getElementById('unfinished-tasks');
const finishedTasks = document.getElementById('finished-tasks');
const cancelTasks = document.getElementById('canceled-tasks');
const toDoArr = [];
let toDoArrFiltered = [];
let toDoArrDate = [];
let toDoArrPriority = [];
let toDoArrFilterPriority = [];
let toDoArrFinish=[];
let toDoArrCancel =[];
const priority = document.getElementById('prioritet');
let counter = 0;
let prior; //глобальный, так как иначе его не видит функция set

function addTask() {
    if (inputTask.value === "") {
        return alert('Введите данные')
    }
    const task = document.getElementById('new-task')
    let toDo = {
        name: task.value,
        prior: priority.value,
        time: new Date().toLocaleString(),
        id: ++counter,
        isVisible: true
    };
    toDoArr.unshift(toDo)
}

function swap(item) {

    if (item.prior === 'short') {
        prior = '<font color="red">низкий</font>'
    } else if (item.prior === 'middle') {
        prior = '<font color="blue">средний</font>'
    } else {
        prior = '<font color="orange">высокий</font>'
    }
    return prior
}

function set(arr,taskTypeBlock) {

    inputTask.value = "";//обнулим значение строки
    let displayTask = '';
    if (!arr.length){
        taskTypeBlock.innerHTML = "";
        return;
    }
    arr.forEach(item => { //выводим элементы
        const prior = swap(item);
        displayTask += `<li id ="${item.id}" class="tasks">${prior}
        <label>${item.name}</label>
        <label>${item.time}</label>
        <i id="${item.id}" onclick="deleteTask(this, toDoArr,unfinishedTasks)" class ="material-icons delete">delete</i>
        <i id = "${item.id}" onclick="finishTask(this)" class ="material-icons">checked</i>
        <i id = "${item.id}" onclick="cancelTask(this)" class ="material-icons">close</i>
        </li>`;
        taskTypeBlock.innerHTML = displayTask;
    })
}

function Add () {
    addTask();
    set(toDoArr, unfinishedTasks);
};

function deleteTask(item,arr, taskTypeBlock) { //todo кнопка удаления задачи, не работает в завершенных и отмененных
    let check = confirm ("Вы действительно хотите удалить задачу?");
    if (check){
    const deleteIndex = arr.findIndex((toDo) => toDo.id === +item.id);
    arr.splice(deleteIndex,1); //здесь должен оказываться нужный массив, но не работает
    unfinishedTasks.removeChild(li);
    // set(toDoArr, unfinishedTasks);
    }
}


document.querySelector('#input2').oninput = function searchTask() { //todo поиск по тексту
    let val = this.value.trim(); //получаем значение, которое пользователь вводит внутрь функции, еще обрезаем пробелы у вводимых данных
    toDoArrFiltered = toDoArr.filter((item) => item.name.includes(val));
    unfinishedTasks.innerHTML = '';
    for (let i = 0; i < val.length; i++) {
        set(toDoArrFiltered, unfinishedTasks)
    }
}

document.querySelector('#sortData').onchange = function sortDate() { //todo сортировка по дате
    let dateEntered = this.value;
    toDoArrDate = toDoArr.slice(0)
    if (dateEntered === "down1") {
        toDoArrDate.sort();
    }
    if (dateEntered === "up1") {
        toDoArrDate.reverse();
    }
    set(toDoArrDate, unfinishedTasks);
}
document.querySelector('#sortPriority').onchange = function sortPriority() { //todo сортировка по приоритету
    let priorityEntered = this.value;
    toDoArrPriority = JSON.parse(JSON.stringify(toDoArr)); //переводим массив в строку, а затем обратно в объект
    if (priorityEntered === "down2") {
        toDoArrPriority.sort((prev, next) => {
            if (prev.prior < next.prior) return -1;
            if (prev.prior > next.prior) return 1;
            else return 0;
        });
    }

    if (priorityEntered === "up2") {
        toDoArrPriority.sort((prev, next) => {
            if ( prev.prior < next.prior) return 1;
            if ( prev.prior > next.prior ) return -1;
            else return 0;
        });
    }
    set(toDoArrPriority, unfinishedTasks);
}

document.querySelector('#filter').onchange = function FilterPriority() { //todo фильтр по приоритету
    let selectedPriority = this.value;
    switch (selectedPriority) {
        case 'low':
            toDoArrFilterPriority = toDoArr.filter(item => item.prior === "short");
            break;
        case 'middle':
            toDoArrFilterPriority = toDoArr.filter(item => item.prior === "middle");
            break;
        case 'high':
            toDoArrFilterPriority = toDoArr.filter(item => item.prior === "high");
            break;
        case 'any':
            toDoArrFilterPriority = JSON.parse(JSON.stringify(toDoArr));
            break;
    }
    set(toDoArrFilterPriority, unfinishedTasks);
}


function handleTask(item, currentArr) { //todo вспомогательная функция для отмененных/завершенных дел
    let finishElement = toDoArr.find(toDo => toDo.id === +item.id);
    currentArr.unshift(finishElement);
    let i = toDoArr.indexOf(finishElement);
    toDoArr.splice(i, 1); //удаление элемента finishElement из массива toDoArr
    set(toDoArr, unfinishedTasks);
    if (toDoArr.length ===0){ //если массив пустой
        unfinishedTasks.innerHTML = "";
    }
}

function finishOrCancelTask(item, arr, element, arrDelete, area){ //todo завершенные или отмененные дела
    let displayTask = '';
    arr.forEach(item => {
        const prior = swap(item);
        displayTask += `<li id ="${item.id}" class= "${element}" >${prior}
        <label>${item.name}</label>
        <label>${item.time}</label>
        <i id="${item.id}" onclick="deleteTask(this, arrDelete)" class ="material-icons delete">delete</i>
        <i id = "${item.id}" onclick="cancelTask(this)" class ="material-icons">close</i>
        </li>`;
        area.innerHTML = displayTask;
    });
}

function finishTask(item) { //todo завершенные дела
    handleTask(item, toDoArrFinish);
    finishOrCancelTask(item, toDoArrFinish, "tasks-finish", toDoArrFinish, finishedTasks) ;
}

function cancelTask (item){ //todo отмененные дела
    handleTask(item, toDoArrCancel);
    finishOrCancelTask(item, toDoArrCancel, "tasks-cancel", toDoArrCancel,cancelTasks);
}


// const checkBoxes = ["active", "canceled", "completed"]; //не получилось
// checkBoxes.forEach( (checkBoxName)=> {
//     document.querySelector('#' + checkBoxName).onchange = function currentStatus(event, arr, area) {
//         if (event.target.checked) {
//             statusChecked.splice(0, 3, checkBoxName);
//             set(arr, area)
//         }
//         else {
//             area.innerHTML = "";
//         }
// }});
//
// switch(checkBoxes) {
//     case 'active':
//         currentStatus(event, toDoArr, unfinishedTasks)
//             break;
//     case 'canceled':
//         currentStatus(event, toDoArrCancel, cancelTasks)
//         break;
//     case 'completed':
//         currentStatus(event, toDoArrFinish, finishedTasks)
//         break;
// }

// function check (selectedStatus){ //todo вспомогательная функция для фильтра по статусу
//     status = statusChecked.findIndex( item => item===selectedStatus);
//     statusChecked.splice(status,1);
// }

function filStatus(event, checkBoxName, arr, area){ //todo вспомогательная функция для фильтра по статусу
    if (event.target.checked) {
            set(arr, area)
        }
        else {
            area.innerHTML = "";
        }
}

document.querySelector('#active').onchange = function activeStatus(event) { //todo фильтр по статусу (активные задачи)
    filStatus(event, "active", toDoArr, unfinishedTasks);
}
document.querySelector('#canceled').onchange = function canceledStatus(event) { //todo фильтр по статусу (отмененные задачи)
    filStatus(event, "canceled", toDoArrCancel, cancelTasks);
}
document.querySelector('#completed').onchange = function completedStatus(event) { //todo фильтр по статусу (завершенные задачи)
    filStatus(event, "completed", toDoArrFinish, finishedTasks);
}



document.querySelector('#unfinished-tasks').onclick = function editTask (){ //todo редактирование текста
    unfinishedTasks.setAttribute("contenteditable", "true");
}




