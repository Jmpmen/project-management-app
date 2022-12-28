const newProjectButton = document.getElementById('newProjectButton');
const newProjectDrawer = document.getElementById('newProjectDrawer');
const addTaskButton = document.getElementById('addTaskButton');
const addTaskDrawer = document.getElementById('addTaskDrawer');
const drawerOverlay = document.getElementById('drawerOverlay')
const todo = document.getElementsByClassName('todo')
const todoDrawer = document.getElementsByClassName('todoDrawer')
const doing = document.getElementsByClassName('doing')
const doingDrawer = document.getElementsByClassName('doingDrawer')
const done = document.getElementsByClassName('done')
const doneDrawer = document.getElementsByClassName('doneDrawer')

newProjectButton.addEventListener('click', function() {
    newProjectDrawer.classList.remove('hidden')
})

addTaskButton.addEventListener('click', function() {
    addTaskDrawer.classList.remove('hidden')
})

drawerOverlay.addEventListener('click', function() {
    newProjectDrawer.classList.add('hidden')
    addTaskDrawer.classList.add('hidden')
    Array.from(todoDrawer).forEach(element => element.classList.add('hidden'))
    Array.from(doingDrawer).forEach(element => element.classList.add('hidden'))
    Array.from(doneDrawer).forEach(element => element.classList.add('hidden'))
})

Array.from(todo).forEach((element,i) => element.addEventListener('click', function() {
    todoDrawer[i].classList.remove('hidden')
}))

Array.from(doing).forEach((element,i) => element.addEventListener('click', function() {
    doingDrawer[i].classList.remove('hidden')
}))

Array.from(done).forEach((element,i) => element.addEventListener('click', function() {
    doneDrawer[i].classList.remove('hidden')
}))