'use strict';

var taskList, title, factory, video;
// regex
var numbers = /^\d+$/;
// internal logic
var handler = null; // keeps track of running handler
var x = 0; // keeps track of total seconds

// wait for DOM to register listeners
document.addEventListener('DOMContentLoaded', function (event) {
    // Global references to DOM elements
    taskList = document.querySelector(".task-list");
    title = document.querySelector('title');
    video = {
        input: document.querySelector('.config-column>*>input'),
        player: document.querySelector('.config-column>.video')
    };
    // load templates into DOM
    let taskTemplate = document.querySelector('.task-template').content.querySelector('.task');
    factory = {
        task: function () { return taskTemplate.cloneNode(true); }
    }
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
    let taskId = taskList.childElementCount;
    let task = factory.task();
    task.setAttribute("data-task-id", String(taskId));
    // add validation handlers
    let lst = task.querySelectorAll('.time-display>input');
    for (let i = 0; i < lst.length; i++) {
        lst[i].addEventListener('keydown', validate);
    }
    // add task handlers
    createDeleteTaskHandler(task);
    createMovementHandlers(task);
    // add to task list
    taskList.appendChild(task);
    // first input
    task.children.item(0).children.item(0).focus()
}

function createDeleteTaskHandler(task) {
    let deleteBtn = task.querySelector('.delete.btn');
    deleteBtn.addEventListener('click', function (params) {
        stop();
        task.remove();
    });
}

function createMovementHandlers(task) {
    task.querySelector('.up.btn').addEventListener('click', function (params) {
        if (!timerRunning() && taskList.firstChild !== task) {
            taskList.insertBefore(task, task.previousSibling);
        }
    });
    task.querySelector('.down.btn').addEventListener('click', function (params) {
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

function getCurrentTask() {
    let task = taskList.querySelector(".task");
    return {
        task: task,
        hour: document.querySelector(".hours"),
        minute: document.querySelector(".minutes"),
        second: document.querySelector(".seconds"),
        label: document.querySelector(".task-label>input")
    };
}

function getValue(field) {
    let result = parseInt(field);
    return isNaN(result) ? 0 : result;
}

// input listeners
// prevent invalid characters from being entered
function validate(event) {
    // console.log(event.key + ' was pressed!');
    if ((!numbers.test(event.key) && event.key.length === 1)
        || (numbers.test(event.key) && String(event.target.value).length == 2)) {
        event.preventDefault();
    }
}

function setTime(h, m, s) {
    let task = getCurrentTask();
    if (task !== null) {
        task.hour.value = xx(h);
        task.minute.value = xx(m);
        task.second.value = xx(s);
        title.innerText = `${task.hour.value}:${task.minute.value}:${task.second.value}`;
    }
}

function timerRunning() {
    return getCurrentTask().label.disabled;
}

function disableInputs(disabled) {
    let task = getCurrentTask();
    if (task !== null) {
        task.hour.disabled = disabled;
        task.minute.disabled = disabled;
        task.second.disabled = disabled;
        task.label.disabled = disabled;
    }
}

function xx(num) {
    return String(num).padStart(2, "0");
}

let pattern = /.*v=(\w+).*/;
function playVideoFromUrl() {
    let url = video.input.value;
    let videoId = url !== '' ? url.match(pattern)[1] : null;
    let embeddedUrl = videoId ? `//www.youtube.com/embed/${videoId}?rel=0&autoplay=1` : null;
    if (embeddedUrl) {
        video.player.setAttribute('src', embeddedUrl);
    }
}

function stopVideo() {
    video.player.setAttribute('src', 'about:blank');
}