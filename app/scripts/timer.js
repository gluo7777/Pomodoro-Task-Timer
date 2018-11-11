'use strict';
// internal logic
let handler = null; // keeps track of running handler
let x = 0; // keeps track of total seconds
import {timer,config,title  } from './utility/page.js';
import {timerTask} from './utility/template.js';

document.addEventListener('DOMContentLoaded', function (event) {
    // add events for timer control buttons
    const timerControl = timer.control;
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
export function addTask() {
    const task = timerTask();
    task.setTaskId(timer.list.childElementCount);
    // add validation handlers
    const lst = task.getTimeInputs();
    for (let i = 0; i < lst.length; i++) {
        lst[i].addEventListener('keydown', validate);
    }
    // add task handlers
    createDeleteTaskHandler(task);
    createMovementHandlers(task);
    // add to task list
    timer.list.appendChild(task);
    // first input
    task.hours.focus();
    return task;
}

function createDeleteTaskHandler(task) {
    task.delete.addEventListener('click', function () {
        stop();
        task.remove();
    });
}

function createMovementHandlers(task) {
    const taskList = timer.list;
    task.up.addEventListener('click', function () {
        if (!timerRunning() && taskList.firstChild !== task) {
            taskList.insertBefore(task, task.previousSibling);
        }
    });
    task.down.addEventListener('click', function () {
        if (!timerRunning() && taskList.lastChild !== task) {
            taskList.insertBefore(task.nextSibling, task);
        }
    });
}

function start() {
    stop();
    stopVideo();
    let task = timer.list.getFirstTask();
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
    title.reset();
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
    let task = timer.list.getFirstTask();
    if (task !== null) {
        task.hour.value = xx(h);
        task.minute.value = xx(m);
        task.second.value = xx(s);
        title.innerText = `${task.hour.value}:${task.minute.value}:${task.second.value}`;
    }
}

function timerRunning() {
    return timer.list.getFirstTask().label.disabled;
}

function disableInputs(disabled) {
    let task = timer.list.getFirstTask();
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

const pattern = /.*v=(\w+).*/;
function playVideoFromUrl() {
    const video = config.video;
    const url = video.input.value;
    const videoId = url !== '' ? url.match(pattern)[1] : null;
    const embeddedUrl = videoId ? `//www.youtube.com/embed/${videoId}?rel=0&autoplay=1` : null;
    if (embeddedUrl) {
        video.player.setAttribute('src', embeddedUrl);
    }
}

function stopVideo() {
    config.video.player.setAttribute('src', 'about:blank');
}