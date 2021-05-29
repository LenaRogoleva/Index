const addButton = document.getElementById('add');
const inputTask = document.getElementById('new-task');
const unfinishedTasks = document.getElementById('unfinished-tasks');
const toDoArr = [];
const toDoArrDelete = [];
let todoArrFiltered = [];
const label = document.createElement('label');
const priority = document.getElementById('prioritet');
//todo для id всё же лучше использовать counter
let counter = 0;

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


function set() {

    inputTask.value = "";//обнулим значение строки
    let displayTask = '';
    // let task = document.createElement('li')
    // task.id = toDoArr[0].id
    // const unfTasks = document.getElementById('unfinished-tasks')
    // const a = document.getElementById('${item.id}')
    // unfTasks.removeChild(a)
    toDoArr.forEach(item => { //выводим элементы
        swap(item);
        //todo привязываем контекст через this
        displayTask += `<li id ="${item.id}" class="tasks">${prior}
        <label>${item.name}</label>
        <label>${item.time}</label>
        <i id="${item.id}" onclick="deleteTask(this)" class ="material-icons delete">delete</i>
        </li>`;
        unfinishedTasks.innerHTML = displayTask;
    })


}

addButton.addEventListener('click', function () {
    addTask();
    set();
});


function swap(item) {
    if (item.prior === 'low') {
        //todo объяви уже этот prior где-нибудь :)
        prior = '<font color="red">низкий</font>'
    } else if (item.prior === 'middle') {
        prior = '<font color="blue">средний</font>'
    } else {
        prior = '<font color="orange">высокий</font>'
    }
    return prior
}

//todo т.к. у тебя логика немного отличается от например Викиной, т.е. ты вяжешь событие напрямую через шаблон,
// то придётся идти на небольшие ухищрения, у i задаём id, пробрасываем контекст элемента и уже в нём получаем id
// можешь открыть консоль и сама посмотреть
function deleteTask(item) {
    console.log(item);
    let toDoArrDelete = toDoArr.slice(0); //копируем элементы в новый массивы
    const deleteIndex = toDoArr.findIndex((item) => item.id === item.id);
    toDoArr.splice(deleteIndex, 1);
    toDoArrDelete.forEach(i => {
        // if (event.target.closest('.delete')) {
        //         // if ($('<i class ="material-icons delete">delete</i>').index(event.target)
        toDoArr.splice(i, 1)
    }); //начиная с i позиции удаляем 1 элемент
    //     }
    let displayTask = '';

    if (toDoArr.length === 0) unfinishedTasks.innerHTML = '' //если массив пустой, то удаляем и из визуала
}

document.querySelector('#input2').oninput = function searchTask() {
    let val = this.value.trim(); //получаем значение, которое пользователь вводит внутрь функции, еще обрезаем пробелы у вводимых данных
    //let elasticItems = document.querySelectorAll(unfinishedTasks.innerHTML); //получаем элементы, откуда получаются данные
    let elasticItems = unfinishedTasks.innerHTML;
    console.log(toDoArr);
    console.log(elasticItems);
    // if (val != '') {
    //     elasticItems.forEach(function (elem){ //перебираем все задачи
    //         if (elem.innerText.search(val) ==-1){ //если внутри задач нет совпадений (search возвращает номер подстроки в строке, если есть, то возвращает номер, если нет, то -1)
    //             elem.classList.add('hide'); //то скрываем, добавляя в css классу unf-tasks display:none
    //         }
    //         else {
    //             elem.classList.remove('hide')
    //         }
    //     })
}


// function finishTask () {
//     console.log(2)
//     }
//
// function closeTask () {

