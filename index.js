const addButton = document.getElementById('add');
const inputTask = document.getElementById('new-task');
const unfinishedTasks = document.getElementById('unfinished-tasks');
const finishedTasks = document.getElementById('finished-tasks');
const toDoArr = [];
let toDoArrFiltered = [];
let toDoArrDate = [];
let toDoArrPriority = [];
let toDoArrFilterPriority = [];
let toDoArrFinish=[];
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

function set(arr) {

    inputTask.value = "";//обнулим значение строки
    let displayTask = '';

    arr.forEach(item => { //выводим элементы
        swap(item);
        displayTask += `<li id ="${item.id}" class="tasks">${prior}
        <label>${item.name}</label>
        <label>${item.time}</label>
        <i id="${item.id}" onclick="deleteTask(this)" class ="material-icons delete">delete</i>
        <i id = "${item.id}" onclick="finishTask(this)" class ="material-icons">checked</i>
        </li>`;
        unfinishedTasks.innerHTML = displayTask;
    })
}

function Add () {
    addTask();
    set(toDoArr);
};

function deleteTask(item) { //todo кнопка удаления задачи
    console.log(item);
    let check = confirm ("Вы действительно хотите удалить задачу?");
    if (check){
    const deleteIndex = toDoArr.findIndex((toDo) => toDo.id === +item.id);
    toDoArr.splice(deleteIndex,1);
    console.log(toDoArr)
    set(toDoArr);
}}

document.querySelector('#input2').oninput = function searchTask() { //todo поиск по тексту
    let val = this.value.trim(); //получаем значение, которое пользователь вводит внутрь функции, еще обрезаем пробелы у вводимых данных
    toDoArrFiltered = toDoArr.filter((item) => item.name.includes(val));
    console.log(toDoArrFiltered);
    unfinishedTasks.innerHTML = '';
    for (let i = 0; i < val.length; i++) {
        set(toDoArrFiltered)
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
    set(toDoArrDate);
}
document.querySelector('#sortPriority').onchange = function sortPriority() { //todo сортировка по приоритету
    let priorityEntered = this.value;
    console.log(priorityEntered);
    toDoArrPriority = JSON.parse(JSON.stringify(toDoArr)); //переводим массив в строку, а затем обратно в объект
    if (priorityEntered === "down2") {
        toDoArrPriority.sort((prev, next) => prev.prior - next.prior );
        //     if ( prev.prior < next.prior) return -1;
        //     if ( prev.prior > next.prior ) return 1;
        //     else return 0;
        // })}
    }
    console.log(toDoArrPriority);

    if (priorityEntered === "up2") {
        toDoArrPriority.sort((prev, next) => next.prior - prev.prior);
        //     if ( prev.prior < next.prior) return 1;
        //     if ( prev.prior > next.prior ) return -1;
        //     else return 0;
        // });
    }
    console.log(toDoArrPriority)

    set(toDoArrPriority);
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
    set (toDoArrFilterPriority);
}

function finishTask(item){ //todo завершенные дела
        let finishElement = toDoArr.find( toDo=> toDo.id === +item.id);
        toDoArrFinish.unshift(finishElement);
        console.log(finishElement)
    //надо прописать удаление элемента finishElement из массива toDoArr

    toDoArrFinish.forEach(finishElement => { //выводим элементы
        swap(finishElement);
        finishedTasks.innerHTML = `<li id ="${finishElement.id}" class="tasks-finish">${prior}
        <label>${finishElement.name}</label>
        <label>${finishElement.time}</label>
        <i id="${finishElement.id}" onclick="deleteTask(this)" class ="material-icons delete">delete</i>
        </li>`;
    })

    toDoArr.forEach( item => { //надо вывести массив toDoArr без элемента finishElement
        swap(item);
        unfinishedTasks.innerHTML += `<li id ="${item.id}" class="tasks">${prior}
        <label>${item.name}</label>
        <label>${item.time}</label>
        <i id="${item.id}" onclick="deleteTask(this)" class ="material-icons delete">delete</i>
        </li>`;
    })

}
document.querySelector('#unfinished-tasks').onclick = function editTask (){ //todo редактирование текста
    unfinishedTasks.setAttribute("contenteditable", "true");
}



//не понимаю, как сделать связь между массивами. Допустим, я отсортировала массив по дате, а потом хочу сделать поиск. В поиске используется уже
//массив toDoArr, а не toDoArrDate. Можно было бы во всех функциях использовать toDoArr, но тогда не будет корректно работать каждая функция.
// Например, в сортировке по дате если сделать просто toDoArr, то при первой сортировке по возрастанию все сработает, а когда я нажимаю сразу после этого
// на сортировку по убыванию, массив не меняется. Что логично, так как он сортирует отсортированный массив, соответственно получает то же самое, что
// было на предыдущем шаге.



