const addButton = document.getElementById('add');
const inputTask = document.getElementById('new-task');
const unfinishedTasks = document.getElementById ('unfinished-tasks');
let unfinishedTasksArr = [] //создаем массив, в котором будем хранить введенные данные
let toDoArr = []
let toDoArrDelete = []
const label = document.createElement('label');
const priority = document.getElementById('prioritet')

function addTask() {
    const task = document.getElementById('new-task')
    let toDo = {
        name: task.value,
        prior: priority.value,
        time: new Date().toLocaleString()
    }
    toDoArr.unshift (toDo)
}

function emptyAddTask(){
    if (inputTask.value === ""){
        return  alert ('Введите данные')
        }
}

function set(){
    inputTask.value="" //обнулим значение строки
    let displayTask = ''

    toDoArr.forEach(item => { //выводим элементы
        swap(item)
        displayTask += `<li class="tasks">${prior}
        <label>${item.name}</label>
        <label>${item.time}</label>
        <i class ="material-icons delete">delete</i>
        </li>`
        unfinishedTasks.innerHTML = displayTask
    })
}
addButton.addEventListener('click', function () {
    addTask();
    emptyAddTask();
    set();
})


function swap(item) { 
    // let selected = document.getElementById('prioritet').options.selectedIndex
    // // let val = document.getElementById('prioritet').options[selected].value; 
    if (item.prior === 'low') {
            prior = '<font color="red">низкий</font>'
            } else if (item.prior === 'middle') {
            prior = '<font color="blue">средний</font>'
            } else {
            prior = '<font color="orange">высокий</font>'
            }
    return prior
    }

function deleteTask(){
    (event) => {
    event.preventDefault() //чтобы не включалось действие по умолчанию
    let toDoArrDelete = toDoArr.slice(0) //копируем элементы в новый массивы
    toDoArrDelete.forEach(i => {

        if (event.target.closest('.delete')) {
            // if ($('<i class ="material-icons delete">delete</i>').index(event.target)) {
            toDoArrDelete.splice(i,1) //начиная с i позиции удаляем 1 элемент
        }
        let displayTask = ''

        if (toDoArr.length === 0) unfinishedTasks.innerHTML = '' //если массив пустой, то удаляем и из визуала       
    })
}
}
unfinishedTasks.addEventListener('click', function() {
    deleteTask()
    set()
})

    // var listItem = this.parentNode //обращаемся к родителю этой кнопки
    // var ul = listItem.parentNode
    // ul.removeChild(listItem) //удаляем из ul listItem
    // deleteButton.remove() 
    // }

function finishTask () {
    console.log(2)
    }

function closeTask () {
    // for (var i=0; i<toDoArr.length; i++){
    // toDoArr.push(toDoArr[i])
    // toDoArr.splice(i,1,toDoArr[i+1])
    // }   
    // console.log(toDoArr)
    
}

// function bindTasksEvent (listItem, checkboxEvent){
//     var checkbox = listItem.querySelector('button.checkbox') 
//     var closeButton = listItem.querySelector('button.close') 
//     var deleteButton = listItem.querySelector('button.delete') 
        
//     checkbox.onclick = checkboxEvent
//     closeButton.onclick = closeTask
//     deleteButton.onclick = deleteTask 
//         }   


// function deleteTask () {
// var listItem = this.parentNode //обращаемся к родителю этой кнопки
// var ul = listItem.parentNode
// ul.removeChild(listItem) //удаляем из ul listItem
// }

// function finishTask () {
//     console.log(2)
// }

// function closeTask () {
// toDoArr.push (toDo)
// }

// function bindTasksEvent (listItem, checkboxEvent){
// var checkbox = listItem.querySelector('button.checkbox') 
// var closeButton = listItem.querySelector('button.close') 
// var deleteButton = listItem.querySelector('button.delete') 

// checkbox.onclick = checkboxEvent
// closeButton.onclick = closeTask
// deleteButton.onclick = deleteTask 
// }


// inputTask.addEventListener('change', function () {
//     console.log('331231')
// })
// function addTask() {
//     if (inputTask.value) { //если значение в inputTask, которое прочитали с помощью value, непустое
//         var listItem = createNewElement (inputTask.value) //записываем в listItem, параметр - то, что вводили в input
//         unfinishedTasks.appendChild(listItem) //добавляем к нашему блоку вывода задач listitem
//         inputTask.value="" //обнулим значение строки
//     } 

// addButton.onclick = addTask //при нажатии на кнопку происходит данный метод
// }