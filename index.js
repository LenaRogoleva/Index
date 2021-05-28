const addButton = document.getElementById('add');
const inputTask = document.getElementById('new-task');
const unfinishedTasks = document.getElementById ('unfinished-tasks');
const toDoArr = [];
const toDoArrDelete = []
const label = document.createElement('label');
const priority = document.getElementById('prioritet');
//todo следить за объявлением переменных, использовать const для значений, которые не меняются, let для всех остальных
//todo небольшая подсказка на будущее: массив ты меняешь, только если заново перезаписываешь его значение,
// то есть меняешь ссылку, например todoArr = [1,2,3] - массив перезаписа, todoArr.splice(0,1) - массив(то есть его ссылка)
// осталась прежней, просто изменилось его содержание, соответственно у тебя в коде пока что массив todoArr - это const
//todo колдуй над кодом дальше и всё получится:)

function addTask() {
    if (inputTask.value === ""){
        return  alert ('Введите данные')
    }
    const task = document.getElementById('new-task')
    //todo использовать id для дальнейшей работы с html и массивом
    let toDo = {
        name: task.value,
        prior: priority.value,
        time: new Date().toLocaleString(),
        id: toDoArr.length
    }
    toDoArr.unshift (toDo)
}


function set(){

    inputTask.value="" //обнулим значение строки
    let displayTask = ''
    // let task = document.createElement('li')
    // task.id = toDoArr[0].id
    // const unfTasks = document.getElementById('unfinished-tasks')
    // const a = document.getElementById('${item.id}')
    // unfTasks.removeChild(a)
    toDoArr.forEach(item => { //выводим элементы
        swap(item)
        //todo использовать привязки событий к конкретному тегу
        //todo использовать id при удалении и редактировании(подсказка)
        displayTask += `<li id ="${item.id}" class="tasks">${prior}
        <label>${item.name}</label>
        <label>${item.time}</label>
        <i onclick="deleteTask(item.id)" class ="material-icons delete">delete</i>
        </li>`
        unfinishedTasks.innerHTML = displayTask;
    })


}
addButton.addEventListener('click', function () {
    addTask();
    set();
})


function swap(item) {
    if (item.prior === 'low') {
            prior = '<font color="red">низкий</font>'
            } else if (item.prior === 'middle') {
            prior = '<font color="blue">средний</font>'
            } else {
            prior = '<font color="orange">высокий</font>'
            }
    return prior
    }
//todo переписать функцию под удаление по id
//todo как вариант, после удаления, пробегать по массиву и перезаписывать id, после перерисовывать форму заново, как в функции set

function deleteTask(){
    (event) => {
        event.preventDefault() //чтобы не включалось действие по умолчанию
        let toDoArrDelete = toDoArr.slice(0) //копируем элементы в новый массивы
        const deleteIndex = toDoArr.findIndex((item) => item.id === id)
        toDoArr.splice(deleteIndex,1);
        toDoArrDelete.forEach(i => {
            // if (event.target.closest('.delete')) {
            //         // if ($('<i class ="material-icons delete">delete</i>').index(event.target)
            toDoArr.splice(i,1) })//начиная с i позиции удаляем 1 элемент
        //     }
        let displayTask = '';

        if (toDoArr.length === 0) unfinishedTasks.innerHTML = '' //если массив пустой, то удаляем и из визуала
//     })
    }}

document.querySelector('#input2').oninput = function searchTask(){
    let val = this.value.trim();
    if (val != '') {
        unfinishedTasks.forEach(function (elem){
            if (elem.innerText.search(val) ==-1){
                elem.classList.add('hide');
            }
            else {
                elem.classList.remove('hide')
            }
        })
    }}




// function finishTask () {
//     console.log(2)
//     }
//
// function closeTask () {

