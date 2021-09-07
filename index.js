const inputTask = document.getElementById('new-task');
const unfinishedTasks = document.getElementById('unfinished-tasks');
const finishedTasks = document.getElementById('finished-tasks');
const cancelTasks = document.getElementById('canceled-tasks');
const allTask = document.getElementById('lowerid');
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


fetch ('http://127.0.0.1:3000/items')
    .then((resp)=> resp.json())
    .then ( result => {
        result.forEach (function(toDo, i, result){
                if (toDo.status === 'finished') {
                    toDoArrFinish.unshift(toDo);
                    set(toDoArrFinish, "tasks-finish", finishedTasks);
                }
                else if (toDo.status === 'canceled') {
                    toDoArrCancel.unshift(toDo);
                    set(toDoArrCancel, "tasks-cancel", cancelTasks);
                }
                else {
                    toDoArr.unshift(toDo);
                    set(toDoArr, "tasks", unfinishedTasks);
                }
        })
    })


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
        status: 2 // 1 - finished, 2 - unfinished, 3 - canceled
    };

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
        <div id = "${item.id + 'div'}" >${item.name}</div>
        <label>${item.time}</label>
        <div class="icons-item">
        <div onclick="deleteTask(${item.id}, toDoArr)" class ="material-icons delete" >delete</div>
        <div onclick="handleTask(${item.id}, toDoArrFinish, 1)" class ="material-icons checked">checked</div>
        <div onclick="handleTask(${item.id}, toDoArrCancel, 3)" class ="material-icons close">close</div>
        <div onclick="saveEditTask (${item.id}, ${item.status})" class ="material-icons save">save</div>
        </div>
        </li>`;
        taskTypeBlock.innerHTML = displayTask;

    })
}
// не хочет видеть именно строку, если писать item.isVisible, то все ок.

function Add () {
    addTask();
    set(toDoArr, "tasks",unfinishedTasks);

}

function deleteTask(item, arr) { //todo кнопка удаления задачи
    let check = confirm ("Вы действительно хотите удалить задачу?");
    if (check){
        const deleteIndex = arr.findIndex((toDo) => toDo.id === item);

        return fetch('http://127.0.0.1:3000/items/' + item, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }).then (async () => {
                toDoArr.splice(deleteIndex, 1)
                let li = document.getElementById(item)
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
    let finishElement = toDoArr.find(toDo => toDo.id === item);
    switch (box) {
        case 1:
            finishElement.status = 1;
            break;
        case 3:
            finishElement.status = 3;
            break;
    }

    fetch ('http://127.0.0.1:3000/items/' + item, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(finishElement)
    })
        .then((resp)=> resp.json())
        .then ( async (data) => {
            toDoArr.splice( toDoArr.indexOf(finishElement),1);
            if (data.status === 1){
                toDoArrFinish.unshift (finishElement);
                set(toDoArrFinish,"tasks-finish", finishedTasks);
                set (toDoArr, "tasks", unfinishedTasks);
            }
            else {
                toDoArrCancel.unshift (finishElement);
                set(toDoArrCancel, "tasks-cancel", cancelTasks);
                set (toDoArr, "tasks", unfinishedTasks);
            }
        })
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



document.querySelector('#lowerid').onclick = function editTask () { //todo редактирование текста
    allTask.setAttribute("contenteditable", "true");
}


        // fetch ('http://127.0.0.1:3000/items/id', {
        //     method: 'PUT',
        //     headers: {
        //         'Content-type': 'application/json; charset=UTF-8'
        //     },
        //     // body: JSON.stringify()
        // })
        //     .then ((resp) => resp.json)
        //     .then (resB => console.log(resB))
        //     .then ((data) => {
        //         if (data === 'ok') {
        //             // в случае успеха, выводим информацию об этом
        //             alert('Изменения успешно сохранены');
        //         } else {
        //             // в случае ошибки, выводим информацию об этом
        //             alert('Произошла ошибка');
        //         }
        //     })

function saveEditTask(id, status ){
    console.log(id);
    console.log(status);
    let editElement;
    let thisElement;
    let element;
    switch (status) {
        case 1:
            editElement = toDoArrFinish.findIndex(toDo => toDo.id === id);
            thisElement = document.getElementById(id + 'div').textContent;
            toDoArrFinish[editElement].name = thisElement;
            element = toDoArrFinish[editElement];
            break;

        case 2:
            editElement = toDoArr.findIndex(toDo => toDo.id === id);
            thisElement = document.getElementById(id + 'div').textContent;
            toDoArr[editElement].name = thisElement;
            element = toDoArr[editElement];
            break;

        case 3:
            editElement = toDoArrCancel.findIndex(toDo => toDo.id === id);
            thisElement = document.getElementById(id + 'div').textContent;
            toDoArrCancel[editElement].name = thisElement;
            element = toDoArrCancel[editElement];
            break;
    }

    fetch ('http://127.0.0.1:3000/items/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(element)
    })
        .then((resp)=> resp.json())
        .then ( async (data) => {
            if (data.status === 1) {
                set(toDoArrFinish, "tasks-finish", finishedTasks);
            }
            else if (data.status === 2){
                set (toDoArr, "tasks", unfinishedTasks);
            }
            else {
                set (toDoArrCancel, "tasks-cancel", cancelTasks);
            }
})
}


// fetch ('http://127.0.0.1:3000/items/' + item, {
//     method: 'PUT',
//     headers: {
//         'Content-Type': 'application/json;charset=utf-8'
//     },
//     body: JSON.stringify(finishElement)
// })
//     .then((resp)=> resp.json())
//     .then ( async (data) => {
//         toDoArr.splice( toDoArr.indexOf(finishElement),1);
//         if (data.status === 1){
//             toDoArrFinish.unshift (finishElement);
//             set(toDoArrFinish,"tasks-finish", finishedTasks);
//             set (toDoArr, "tasks", unfinishedTasks);
//         }
//         else {
//             toDoArrCancel.unshift (finishElement);
//             set(toDoArrCancel, "tasks-cancel", cancelTasks);
//             set (toDoArr, "tasks", unfinishedTasks);
//         }
//     })
// }





