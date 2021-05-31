const addButton = document.getElementById('add');
const inputTask = document.getElementById('new-task');
const unfinishedTasks = document.getElementById('unfinished-tasks');
const toDoArr = [];
let toDoArrFiltered = [];
const label = document.createElement('label');
const priority = document.getElementById('prioritet');
//todo для id всё же лучше использовать counter
let counter = 0;
let prior;

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

function set() {

    inputTask.value = "";//обнулим значение строки
    let displayTask = '';

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


//todo т.к. у тебя логика немного отличается от например Викиной, т.е. ты вяжешь событие напрямую через шаблон,
// то придётся идти на небольшие ухищрения, у i задаём id, пробрасываем контекст элемента и уже в нём получаем id
// можешь открыть консоль и сама посмотреть
function deleteTask(item) {
    console.log(item);
    // let toDoArrDelete = toDoArr.slice(0); //копируем элементы в новый массивы
    const deleteIndex = toDoArr.findIndex((toDo) => toDo.id === '<i id="${item.id}">delete</i>');
    //toDoArr.splice(deleteIndex-1, 1); //todo работает, когда иду из середины, не важно в каком порядке
    toDoArr.splice(deleteIndex+0,1); //todo работает, когда иду от первой задачи к последующим последовательно
    console.log(toDoArr)
    set();

    if (toDoArr.length === 0) unfinishedTasks.innerHTML = '' //если массив пустой, то удаляем и из визуала
}

document.querySelector('#input2').oninput = function searchTask() {
    let val = this.value.trim(); //получаем значение, которое пользователь вводит внутрь функции, еще обрезаем пробелы у вводимых данных
    toDoArrFiltered = toDoArr.filter((item) => item.name.includes(val));
    console.log(toDoArrFiltered);
    unfinishedTasks.innerHTML = '';
    for (let i = 0; i < val.length; i++) {
        toDoArrFiltered.forEach(item => { //выводим элементы
            swap(item);
            unfinishedTasks.innerHTML += `<li id ="${item.id}" class="tasks">${prior}
        <label>${item.name}</label>
        <label>${item.time}</label>
        <i id="${item.id}" onclick="deleteTask(this)" class ="material-icons delete">delete</i>
        </li>`;
        })
    }
}



// function finishTask () {
//     console.log(2)
//     }
//
// function closeTask () {

