const inputTask = document.getElementById('new-task');
const unfinishedTasks = document.getElementById('unfinished-tasks');
const finishedTasks = document.getElementById('finished-tasks');
const cancelTasks = document.getElementById('canceled-tasks');
let toDoArr = [];
let toDoArrFiltered = [];
let toDoArrDate = [];
let toDoArrPriority = [];
let toDoArrFilterPriority = [];
let toDoArrFinish=[];
let toDoArrCancel =[];
const priority = document.getElementById('priority');
let counter = 0;
let prior; //глобальный, так как иначе его не видит функция set

fetch('http://127.0.0.1:3000/items')
    .then(response => response.json())
    .then(result => {
        toDoArr = result;
        toDoArrFinish = result;
        set(toDoArr, "tasks", unfinishedTasks);
        set(toDoArrFinish, "tasks-finish", finishedTasks);
    })

// fetch('http://127.0.0.1:3000/items')
//     .then(response => response.json())
//     .then(result => {
//         toDoArrFinish = result;
//         set(toDoArrFinish, "tasks-finish", finishedTasks)
//     })


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
        isVisible: true,
        status: 'unfinished'
    };
    // toDoArr.push(toDo);
    fetch('http://127.0.0.1:3000/items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(toDo)
    }).then((resp) => resp.json())
        .then(async (data) => {
        toDoArr.push(data);
        set(toDoArr, "tasks", unfinishedTasks);
    }).catch (error => {
        alert (error);
    })

}

function swap(item) {

    if (item.prior === 'short') {
        prior = '<font color= #3399CC>низкий</font>'
    } else if (item.prior === 'middle') {
        prior = '<font color= #00CC66>средний</font>'
    } else {
        prior = '<font color= #FF9933>высокий</font>'
    }
    return prior
}

function set(arr, areaClass, taskTypeBlock) {

    inputTask.value = "";//обнулим значение строки
    let displayTask = '';
    if (!arr.length){
        taskTypeBlock.innerHTML = "";
        return;
    }
    arr.forEach(item => { //выводим элементы
        const prior = swap(item);
        displayTask += `<li id ="${item.id}" class="${areaClass}">${prior}
        <td>${item.name}</td>
        <label>${item.time}</label>
        <i id="${item.id}" onclick="deleteTask(this, toDoArr)" class ="material-icons delete">delete</i>
        <i id = "${item.id}" onclick="handleTask(this, toDoArrFinish, 'finished')" class ="material-icons">checked</i>
        <i id = "${item.id}" onclick="handleTask(this, toDoArrCancel, 'canceled')" class ="material-icons">close</i>
        <i id = "${item.id}" onclick="saveEditTask()" class ="material-icons">save</i>
        </li>`;
        taskTypeBlock.innerHTML = displayTask;

    })
}

function Add () {
    addTask();
    set(toDoArr, "tasks",unfinishedTasks);

}

function deleteTask(item, arr) { //todo кнопка удаления задачи
    let check = confirm ("Вы действительно хотите удалить задачу?");
    if (check){
        const deleteIndex = arr.findIndex((toDo) => toDo.id === +item.id);

        return fetch('http://127.0.0.1:3000/items/' + item.id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }).then (async () => {
                toDoArr.splice(deleteIndex, 1)
                let li = document.getElementById(item.id)
                li.remove()
            })
            .catch (error => {
                alert (error);
            })
    }
}


document.querySelector('#input2').oninput = function searchTask() { //todo поиск по тексту
    let val = this.value.trim(); //получаем значение, которое пользователь вводит внутрь функции, еще обрезаем пробелы у вводимых данных
    for (let i = 0; i < val.length; i++) {
        toDoArrFiltered = toDoArr.filter((item) => item.name.includes(val));
        set(toDoArrFiltered, "tasks", unfinishedTasks);
    }
    if (!val.length){
        set (toDoArr, "tasks", unfinishedTasks);
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
    set(toDoArrDate, "tasks", unfinishedTasks);
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
    set(toDoArrPriority, "tasks", unfinishedTasks);
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
    set(toDoArrFilterPriority, "tasks", unfinishedTasks);
}


function handleTask(item, currentArr, box) { //todo вспомогательная функция для отмененных/завершенных дел
    let finishElement = toDoArr.find(toDo => toDo.id === +item.id);
    switch (box) {
        case 'finished':
            toDoArrFinish.push(finishElement);
            finishElement.status = 'finished';
            break;
        case 'canceled':
            toDoArrCancel.push(finishElement);
            finishElement.status = 'canceled';
            break;
        case 'unfinished':
            toDoArr.push(finishElement);
            break;
    }


    fetch ('http://127.0.0.1:3000/items/' + item.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(finishElement)
    })
        .then((resp)=> resp.json())
        .then ( async (data) => {
            currentArr.push(data);
            if (data.status === 'finished'){ // в какой момент надо присвоить статусу finished или canceled?
                set(toDoArrFinish,"tasks-finish", finishedTasks);
            }
            if (data.status === 'canceled'){
                set(toDoArrCancel, "tasks-cancel", cancelTasks);
            }
            else {
                set (toDoArr, "tasks", unfinishedTasks)
            }
        })
    // fetch('http://127.0.0.1:3000/items', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json;charset=utf-8'
    //     },
    //     body: JSON.stringify(finishElement)
    // })
    //     .then((resp) => resp.json())
    //     .then(async (data) => {
    //         currentArr.push(data);
    //         currentArr.forEach( function(toDo){
    //             if (toDo.status === 'finished'){ // в какой момент надо присвоить статусу finished или canceled?
    //                 set(toDoArrFinish,"tasks-finish", finishedTasks);
    //             }
    //             if (toDo.status === 'canceled'){
    //                 set(toDoArrCancel, "tasks-cancel", cancelTasks);
    //             }
    //             else {
    //                 set (toDoArr, "tasks", unfinishedTasks)
    //             }
    //         })
    //     })
    //     .catch (error => {
    //     alert (error);
    // })
    // fetch('http://127.0.0.1:3000/items/id', {
    //     method: 'DELETE',
    //     headers: {
    //         'Content-Type': 'application/json;charset=utf-8'
    //     },
    // }).then (()=> {
    //     toDoArr.splice(toDoArr.indexOf(finishElement), 1); //удаление элемента finishElement из массива toDoArr
    //     set(toDoArr, "tasks", unfinishedTasks);
    // })
    }



const checkBoxes = ["active", "canceled", "completed"]; //todo для фильтра по статусу
const activeCheckBoxes = [];
const statusArea = {
    active: unfinishedTasks,
    completed: finishedTasks,
    canceled: cancelTasks
}

function filStatus(event, checkBoxName, arr, areaClass, area) { //todo вспомогательная функция для фильтра по статусу
    if (event.target.checked) {
        activeCheckBoxes.push(checkBoxName);
        checkBoxes.forEach((boxName) => {
            if (!activeCheckBoxes.includes(boxName)) {
                statusArea[boxName].innerHTML = ''
            } else {
                set(arr, areaClass, area);
            }
        })
    } else {
        if (!activeCheckBoxes.length) {
            set(toDoArr, "tasks", unfinishedTasks);
            set(toDoArrCancel, "tasks-cancel", cancelTasks);
            set(toDoArrFinish, "tasks-finish", finishedTasks);
        } else {
            area.innerHTML = "";
        }
    }
}

document.querySelector('#active').onchange = function activeStatus(event) { //todo фильтр по статусу (активные задачи)
    filStatus(event, "active", toDoArr, "tasks", unfinishedTasks);
}
document.querySelector('#canceled').onchange = function canceledStatus(event) { //todo фильтр по статусу (отмененные задачи)
    filStatus(event, "canceled", toDoArrCancel, "tasks-cancel", cancelTasks);
}
document.querySelector('#completed').onchange = function completedStatus(event) { //todo фильтр по статусу (завершенные задачи)
    filStatus(event, "completed", toDoArrFinish, "tasks-finish", finishedTasks);
}



document.querySelector('#unfinished-tasks').onclick = function editTask () { //todo редактирование текста
    unfinishedTasks.setAttribute("contenteditable", "true");

        fetch ('http://127.0.0.1:3000/items/id', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            // body: JSON.stringify()
        })
            .then ((resp) => resp.json)
            .then (resB => console.log(resB))
            // .then ((data) => {
            //     if (data === 'ok') {
            //         // в случае успеха, выводим информацию об этом
            //         alert('Изменения успешно сохранены');
            //     } else {
            //         // в случае ошибки, выводим информацию об этом
            //         alert('Произошла ошибка');
            //     }
            // })
    }






