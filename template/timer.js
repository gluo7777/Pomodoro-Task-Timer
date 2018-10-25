'use strict';

var taskList;
// static task template
var taskString = '<div class="task" data-task-id="1">'
    + '<div class="time-display">'
    + '<input type="text" name="" class="hours" placeholder="HH">:'
    + '<input type="text" name="" class="minutes" placeholder="mm">:'
    + '<input type="text" name="" class="seconds" placeholder="ss">'
    + '<div class="task-menu">'
    + '<div class="material-icons deleteBtn">delete</div>'
    + '</div>'
    + '</div>'
    + '<div class="task-label">'
    + '<input type="text" name="task" placeholder="Enter Task Name">'
    + '</div></div>';
// regex
var numbers = /^\d+$/;
// internal logic
var handler = null; // keeps track of running handler
var x = 0; // keeps track of total seconds

// wait for DOM to register listeners
document.addEventListener('DOMContentLoaded', function (event) {
    // reference to task list
    taskList = document.querySelector(".task-list");
    // add events for buttons
    document.querySelector("#start").addEventListener('click', start);
    document.querySelector("#stop").addEventListener('click', stop);
    document.querySelector("#reset").addEventListener('click', reset);
    document.querySelector("#addTask").addEventListener("click", addTask);
    document.querySelector("#select").addEventListener('click', select);
});


/**
 * When adding task item ui, just record the task reference # (as meta property). 
 * data-task-id (auto-generated) - position of item in list
 */
function addTask() {
    var taskId = taskList.childElementCount;
    var task = htmlToElement(taskString);
    task.setAttribute("data-task-id", String(taskId));
    // add validation handlers
    var lst = task.querySelectorAll('.time-display>input');
    for (let i = 0; i < lst.length; i++) {
        lst[i].addEventListener('keydown', validate);
    }
    // add delete task handler
    createDeleteTaskHandler(task);
    // add to task list
    taskList.appendChild(task);
    // first input
    task.children.item(0).children.item(0).focus()
}

/**
 * add reference to task in function
 * @param {*} params 
 */
function createDeleteTaskHandler(task) {
    let deleteBtn = task.querySelector('.deleteBtn');
    deleteBtn.addEventListener('click', function (params) {
        task.remove();
    });
}

function start() {
    stop();
    var task = getCurrentTask();
    x = getValue(task.second.value) + getValue(task.minute.value) * 60 + getValue(task.hour.value) * 3600;
    if (x > 0) {
        // disable inputs
        disableInputs(true);
        handler = setInterval(function () {
            if (x <= 0) {
                stop();
            } else {
                x = x - 1;
                s = Math.floor(x % 60);
                m = Math.floor((x / 60) % 60);
                h = Math.floor((x / 3600) % 24);
                setTime(h, m, s);
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

function getCurrentTask() {
    var task = taskList.querySelector(".task");
    var hour = document.querySelector(".hours");
    var minute = document.querySelector(".minutes");
    var second = document.querySelector(".seconds");
    return {
        task: task,
        hour: hour,
        minute: minute,
        second: second
    };
}

function getValue(field) {
    var result = parseInt(field);
    return isNaN(result) ? 0 : result;
}

// input listeners
// prevent invalid characters from being entered
function validate(event) {
    console.log(event.key + ' was pressed!');
    if (numbers.test(event.key) !== true && event.key.length === 1) {
        event.preventDefault();
    }
}

function setTime(h, m, s) {
    var task = getCurrentTask();
    task.hour.value = xx(h);
    task.minute.value = xx(m);
    task.second.value = xx(s);
}

function disableInputs(disabled) {
    var task = getCurrentTask();
    task.hour.disabled = disabled;
    task.minute.disabled = disabled;
    task.second.disabled = disabled;
}

function xx(num) {
    return String(num).padStart(2, "0");
}

function htmlToElement(html) {
    // template elmeent introduced in HTML5 has no restrictions on children
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}