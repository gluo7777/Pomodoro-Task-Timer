'use strict';
// internal logic
let handler = null; // keeps track of running handler
let x = 0; // keeps track of total seconds
let html;

// wait for DOM to register listeners
document.addEventListener('DOMContentLoaded', function (event) {
    // Global references to DOM elements
    html = page.loadDomElements();
    // add events for Task Panel buttons
    const timerControl = html.timer.control;
    timerControl.start.addEventListener('click', start);
    timerControl.stop.addEventListener('click', stop);
    timerControl.reset.addEventListener('click', reset);
    timerControl.add.addEventListener("click", addTask);
    timerControl.select.addEventListener('click', select);
});

/**
 * When adding task item ui, just record the task reference # (as meta property). 
 * data-task-id (auto-generated) - position of item in list
 */
function addTask() {
    let task = factory.timerTask();
    task.setTaskId(html.timer.list.childElementCount);
    // add validation handlers
    let lst = task.getTimeInputs();
    for (let i = 0; i < lst.length; i++) {
        lst[i].addEventListener('keydown', validate);
    }
    // add task handlers
    createDeleteTaskHandler(task);
    createMovementHandlers(task);
    // add to task list
    html.timer.list.appendChild(task);
    // first input
    task.hours.focus();
    return task;
}

function createDeleteTaskHandler(task) {
    let deleteBtn = task.querySelector('.delete.btn');
    deleteBtn.addEventListener('click', function () {
        stop();
        task.remove();
    });
}

function createMovementHandlers(task) {
    const taskList = html.timer.list;
    task.querySelector('.up.btn').addEventListener('click', function () {
        if (!timerRunning() && taskList.firstChild !== task) {
            taskList.insertBefore(task, task.previousSibling);
        }
    });
    task.querySelector('.down.btn').addEventListener('click', function () {
        if (!timerRunning() && taskList.lastChild !== task) {
            taskList.insertBefore(task.nextSibling, task);
        }
    });
}

function start() {
    stop();
    stopVideo();
    let task = getCurrentTask();
    x = getValue(task.second.value) + getValue(task.minute.value) * 60 + getValue(task.hour.value) * 3600;
    if (x > 0) {
        // disable inputs
        disableInputs(true);
        handler = setInterval(function () {
            if (x <= 0) {
                stop();
                playVideoFromUrl();
            } else {
                x = x - 1;
                setTime(Math.floor(x / 3600), Math.floor((x / 60) % 60), Math.floor(x % 60));
            }
        }, 1000);
    }
};

function stop() {
    // enable inputs
    disableInputs(false);
    if (handler) {
        clearInterval(handler);
        handler = null;
    }
};

function reset() {
    stop();
    x = 0;
    setTime(0, 0, 0);
};

//// Helper Functions ////
function getValue(field) {
    let result = parseInt(field);
    return isNaN(result) ? 0 : result;
}

// input listeners
// prevent invalid characters from being entered
function validate(event) {
    const numbers = /^\d+$/;
    // console.log(event.key + ' was pressed!');
    if ((!numbers.test(event.key) && event.key.length === 1)
        || (numbers.test(event.key) && String(event.target.value).length == 2)) {
        event.preventDefault();
    }
}

function setTime(h, m, s) {
    let task = html.timer.list.getCurrentTask();
    if (task !== null) {
        task.hour.value = xx(h);
        task.minute.value = xx(m);
        task.second.value = xx(s);
        html.title.innerText = `${task.hour.value}:${task.minute.value}:${task.second.value}`;
    }
}

function timerRunning() {
    return html.timer.list.getCurrentTask().label.disabled;
}

function disableInputs(disabled) {
    let task = html.timer.list.getCurrentTask();
    if (task !== null) {
        task.hour.disabled = disabled;
        task.minute.disabled = disabled;
        task.second.disabled = disabled;
        task.label.disabled = disabled;
    }
}

function xx(num) {
    return String(num).padStart(2, '0');
}