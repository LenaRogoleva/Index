const addButton = document.getElementById('add');
const inputTask = document.getElementById('new-task');
const unfinishedTasks = document.getElementById('unfinished-tasks');
const toDoArr = [];
let toDoArrFiltered = [];
let toDoArrDate = [];
let toDoArrPriority = [];
let toDoArrFilterPriority = [];
let toDoArrFinish=[];
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
    if (item.prior === 'short') {
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
        <i id = "${item.id}" onclick="finishTask(this)" class ="material-icons">checked</i>
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
function deleteTask(item) { //todo кнопка удаления задачи
    console.log(item);
    let check = confirm ("Вы действительно хотите удалить задачу?");
    if (check === true){
    // let toDoArrDelete = toDoArr.slice(0); //копируем элементы в новый массивы
    const deleteIndex = toDoArr.findIndex((toDo) => toDo.id === '<i id="${item.id}">delete</i>');
    //toDoArr.splice(deleteIndex-1, 1); //todo работает, когда иду из середины
    toDoArr.splice(deleteIndex+0,1); //todo работает, когда иду от первой задачи к последующим последовательно
    console.log(toDoArr)
    set();

    if (toDoArr.length === 0) unfinishedTasks.innerHTML = '' //если массив пустой, то удаляем и из визуала
}}

document.querySelector('#input2').oninput = function searchTask() { //todo поиск по тексту
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


document.querySelector('#sortData').onchange = function sortDate() { //todo сортировка по дате
    let dateEntered = this.value;
    console.log(dateEntered)
    toDoArrDate = toDoArr.slice(0)
    if (dateEntered === "down1") {
        toDoArrDate.sort();
        console.log(toDoArrDate)
    }
    if (dateEntered === "up1") {
        toDoArrDate.reverse();
        console.log(toDoArrDate)
    }
    let displayTask = ''; //перерисовываю форму, по идее надо обратиться к функции set, но в ней другой массив обрабатывается, поэтому пишу все заново для нового массива
    toDoArrDate.forEach(item => { //выводим элементы
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
document.querySelector('#sortPriority').onchange = function sortPriority(){ //todo сортировка по приоритету
        let priorityEntered = this.value;
        console.log(priorityEntered);
        toDoArrPriority = toDoArr.slice(0);
        if (priorityEntered === "down2") {
            toDoArrPriority.sort((prev, next) => {
                if ( prev.prior < next.prior) return -1;
                if ( prev.prior > next.prior ) return 1;
                else return 0;
            })}
            console.log(toDoArrPriority);

            if (priorityEntered === "up2") {
                toDoArrPriority.sort((prev, next) => {
                    if ( prev.prior < next.prior) return 1;
                    if ( prev.prior > next.prior ) return -1;
                    else return 0;
                });
                console.log(toDoArrPriority)
        }
    let displayTask = ''; //перерисовываю форму, по идее надо обратиться к функции set, но в ней другой массив обрабатывается, поэтому пишу все заново для нового массива
    toDoArrPriority.forEach(item => { //выводим элементы
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

document.querySelector('#filter').onchange = function FilterPriority(){ //todo фильтр по приоритету
    let selectedPriority = this.value;
    console.log(selectedPriority)
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
        toDoArrFilterPriority = toDoArr.slice(0);
        }
    let displayTask = ''; //перерисовываю форму, по идее надо обратиться к функции set, но в ней другой массив обрабатывается, поэтому пишу все заново для нового массива
    toDoArrFilterPriority.forEach(item => { //выводим элементы
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
function finishTask(){
    // for (let i=0; i < toDoArr.length; i++) {
        let finishIndex = toDoArr.find( (toDo)=> toDo.id === '<i id = "${item.id}" >checked</i>');
        // toDoArrFinish.unshift(item);
        console.log(finishIndex)
    toDoArr.forEach(item => { //выводим элементы, здесь нужен новый массив
        swap(item);
        unfinishedTasks.innerHTML += `<li id ="${item.id}" class="tasks-finish">${prior}
        <label>${item.name}</label>
        <label>${item.time}</label>
        <i id="${item.id}" onclick="deleteTask(this)" class ="material-icons delete">delete</i>
        </li>`;
    })
    // }
}




//не понимаю, как сделать связь между массивами. Допустим, я отсортировала массив по дате, а потом хочу сделать поиск. В поиске используется уже
//массив toDoArr, а не toDoArrDate. Можно было бы во всех функциях использовать toDoArr, но тогда не будет корректно работать каждая функция.
// Например, в сортировке по дате если сделать просто toDoArr, то при первой сортировке по возрастанию все сработает, а когда я нажимаю сразу после этого
// на сортировку по убыванию, массив не меняется. Что логично, так как он сортирует отсортированный массив, соответственно получает то же самое, что
// что было на предыдущем шаге.



