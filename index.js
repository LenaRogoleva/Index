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
let statusChecked = [];

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

function set(arr,taskTypeBlock, arrDelete) {

    inputTask.value = "";//обнулим значение строки
    let displayTask = '';

    arr.forEach(item => { //выводим элементы
        swap(item);
        displayTask += `<li id ="${item.id}" class="tasks">${prior}
        <label>${item.name}</label>
        <label>${item.time}</label>
        <i id="${item.id}" onclick="deleteTask(this, arrDelete)" class ="material-icons delete">delete</i>
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

function deleteTask(item,arrDelete) { //todo кнопка удаления задачи
    let check = confirm ("Вы действительно хотите удалить задачу?");
    if (check){
    const deleteIndex = toDoArr.findIndex((toDo) => toDo.id === +item.id);
    arrDelete.splice(deleteIndex,1); //здесь должен оказываться нужный массив, но не работает
    set(toDoArr, unfinishedTasks);
}}

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

document.querySelector('#filter').onchange = function FilterPriority(){ //todo фильтр по приоритету
    let selectedPriority = this.value;
        if (selectedPriority === "low") {
        toDoArrFilterPriority = toDoArr.filter( item => item.prior === "short")
        }
        if (selectedPriority === "middle") {
        toDoArrFilterPriority = toDoArr.filter( item => item.prior === "middle")
        }
        if (selectedPriority === "high") {
        toDoArrFilterPriority = toDoArr.filter(item => item.prior === "high")
        }
        if (selectedPriority === "any") {
        toDoArrFilterPriority = JSON.parse(JSON.stringify(toDoArr));
        }
    set (toDoArrFilterPriority, unfinishedTasks);
}

function finishTask(item) { //todo завершенные дела
    let finishElement = toDoArr.find(toDo => toDo.id === +item.id);
    toDoArrFinish.unshift(finishElement);
    let i = toDoArr.indexOf(finishElement);
    toDoArr.splice(i, 1); //удаление элемента finishElement из массива toDoArr
    set(toDoArr, unfinishedTasks);
    let displayTask = '';

    toDoArrFinish.forEach(item => { //выводим элементы, добавила новый класс
        swap(item);
        displayTask += `<li id ="${item.id}" class="tasks-finish">${prior}
        <label>${item.name}</label>
        <label>${item.time}</label>
        <i id="${item.id}" onclick="deleteTask(this,toDoArrFinish)" class ="material-icons delete">delete</i>
        <i id = "${item.id}" onclick="cancelTask(this)" class ="material-icons">close</i>
        </li>`;
        finishedTasks.innerHTML = displayTask;
    });
}

// function finishTask(item) { //функция, которая работает с одним массивом toDoArr, но я не знаю, как добавить класс определенному элементу, чтобы был зеленый цвет
//     let finishElement = toDoArr.find(toDo=> toDo.id === +item.id);
//     let i= toDoArr.indexOf(finishElement);
//     toDoArr.splice(i,1);
//     toDoArr.unshift (finishElement);
// });
// };

function cancelTask(item){ //todo отмененные дела
    let cancelElement = toDoArr.find(toDo => toDo.id === +item.id);
    toDoArrCancel.unshift (cancelElement);
    let i = toDoArr.indexOf(cancelElement);
    toDoArr.splice(i, 1); //удаление элемента finishElement из массива toDoArr
    set(toDoArr, unfinishedTasks);
    let displayTask = '';

    toDoArrCancel.forEach(item => { //выводим элементы, добавила новый класс
        swap(item);
        displayTask += `<li id ="${item.id}" class="tasks-cancel">${prior}
        <label>${item.name}</label>
        <label>${item.time}</label>
        <i id="${item.id}" onclick="deleteTask(this, toDoArrCancel)" class ="material-icons delete">delete</i>
        <i id = "${item.id}" onclick="finishTask(this)" class ="material-icons">checked</i>
        </li>`;
        cancelTasks.innerHTML = displayTask;
    });
}

function check (selectedStatus){ //вспомогательная функция для фильтра по статусу
    status = statusChecked.findIndex( item => item===selectedStatus);
    statusChecked.splice(status,1);
}
document.querySelector('#active').onchange = function activeStatus(event){ //todo фильтр по статусу (активные задачи)
    if (event.target.checked) {
        statusChecked.unshift("active");
        check("canceled");
        check("completed")
        set(toDoArr, unfinishedTasks)
    } else {
        unfinishedTasks.innerHTML = "";
    }
    if (statusChecked.includes("canceled")) {
        set(toDoArrCancel, cancelTasks)
    }
    if (statusChecked.includes("completed")) {
        set(toDoArrFinish, finishedTasks)
    }
}

document.querySelector('#canceled').onchange = function canceledStatus(event) { //todo фильтр по статусу (отмененные задачи)
    if (event.target.checked) {
        statusChecked.unshift("canceled");
        check ("active")
        check ("completed")
        set(toDoArrCancel, cancelTasks)
    } else {
        cancelTasks.innerHTML = "";
    }
    if (statusChecked.includes("active")) {
        set(toDoArr, unfinishedTasks)
    }
    if (statusChecked.includes("completed")) {
        set(toDoArrFinish, finishedTasks)
    }
}

document.querySelector('#completed').onchange = function completedStatus(event){ //todo фильтр по статусу (завершенные задачи)
    if (event.target.checked) {
        statusChecked.unshift("completed");
        check("canceled");
        check ("active")
        set(toDoArrFinish, finishedTasks)
    } else {
        finishedTasks.innerHTML = "";
    }
    if (statusChecked.includes("canceled")) {
        set(toDoArrCancel, cancelTasks)
    }
    if (statusChecked.includes("active")) {
        set(toDoArr, unfinishedTasks)
    }
}


document.querySelector('#unfinished-tasks').onclick = function editTask (){ //todo редактирование текста
    unfinishedTasks.setAttribute("contenteditable", "true");
}




