'use strict';
// dom
var taskList, title, video;
var config;
// regex
var numbers = /^\d+$/;
// internal logic
var handler = null; // keeps track of running handler
var x = 0; // keeps track of total seconds

let html;

// wait for DOM to register listeners
document.addEventListener('DOMContentLoaded', function (event) {
    // Global references to DOM elements
    html = page.loadDomElements();
    taskList = html.timer.list;
    title = html.title;
    // initialize conig panel tabs
    let config = html.config;
    config.tab.video.addEventListener('click', (e) => displayTab('video-panel'));
    config.tab.import.addEventListener('click', (e) => displayTab('imported-task-panel'));
    let importList = config.import.list;
    let selectList = config.import.select;
    selectList.addEventListener('change', event => {
        // get name of selected option
        let listId = event.target.selectedOptions[0].getAttribute('data-task-list-id');
        // hide unhidden tasks
        for (let task of config.import.list.querySelectorAll('.imported-task.active-task')) {
            task.classList.remove('active-task');
        }
        // unhide tasks in selected list
        for (let task of config.import.list.querySelectorAll(`.imported-task[data-task-list-id=${listId}]`)) {
            task.classList.add('active-task');
        }
    });
    // initialize Google OAuth2 services and set handlers
    //// add handling of each list name
    taskapi.setListHandler(function (list) {
        let option = document.createElement('option');
        option.value = list.title;
        option.innerText = list.title;
        option.setAttribute('data-task-list-id', list.id);
        selectList.options.add(option);
    });
    //// add handling of each task
    taskapi.setTaskHandler(function addTaskToDisplay(task) {
        // add task list to select if not already there
        // instantiate template and use task to populate it
        let template = factory.importedTask();
        template.querySelector('#list').value = task.listName;
        template.setAttribute('data-task-list-id', task.listId);
        template.querySelector('#task').value = task.taskName;
        template.setAttribute('data-task-id', task.taskId);
        template.querySelector('#description').value = task.notes ? task.notes : '';
        // set eventListeners
        template.querySelector('#addToTaskList').addEventListener('click', e => {
            let newTask = addTask();
            newTask.querySelector('.task-label>input').value = `[${task.listName}] ${task.taskName}`;
            importList.removeChild(template);
        });
        template.querySelector('#removeFromImportList').addEventListener('click', e => {
            importList.removeChild(template);
        });
        // unhide if list name matches selected list
        if (task.listId === selectList.selectedOptions[0].getAttribute('data-task-list-id')) {
            template.classList.add('active-task');
        }
        // then add it to import-task-list
        importList.appendChild(template);
    });
    taskapi.setSignInHandler(function (signedIn) {
        if (signedIn) {
            importTasks();
        }
    });
    taskapi.initializeAPI();
    // add events for buttons
    //// Task Panel
    document.querySelector("#start").addEventListener('click', start);
    document.querySelector("#stop").addEventListener('click', stop);
    document.querySelector("#reset").addEventListener('click', reset);
    document.querySelector("#addTask").addEventListener("click", addTask);
    document.querySelector("#select").addEventListener('click', select);
    //// Import Panel
    document.querySelector("#sync").addEventListener('click', importTasks);
    document.querySelector("#accounts").addEventListener('click', switchAccounts);
    // document.querySelector("#sync").addEventListener('click', selectImportedTasks);
});

/**
 * 
 * @param {tab which triggered this} event 
 * @param {name of panel to open} panelName 
 */
function displayTab(panelName) {
    // reset other panels
    document.querySelector('.tablinks.active').classList.remove('active');
    document.querySelector('.config-column>.panel.active').classList.remove('active');
    // activate target panel
    document.querySelector(`#open-${panelName}`).classList.add('active');
    document.querySelector(`#${panelName}`).classList.add('active');
}

/**
 * When adding task item ui, just record the task reference # (as meta property). 
 * data-task-id (auto-generated) - position of item in list
 */
function addTask() {
    let task = factory.timerTask();
    task.setTaskId(taskList.childElementCount);
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

//// Import Panel ////
function importTasks() {
    let importPanel = html.config.import;
    // reset select list
    let selectList = importPanel.select;
    while (selectList.childElementCount > 0) {
        selectList.removeChild(selectList.firstChild);
    }
    // reset list of imported tasks
    let importList = importPanel.list;
    while (importList.childElementCount > 0) {
        importList.removeChild(importList.firstChild);
    }
    if (!taskapi.authorized()) {
        taskapi.login();
    }
    // AJAX call to asynchronously import and display tasks
    taskapi.listTaskLists();
}

function switchAccounts() {
    if (taskapi.authorized()) {
        taskapi.logout();
    }
    taskapi.login();
}

//// Helper Functions ////

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
    let task = html.timer.list.getCurrentTask();
    if (task !== null) {
        task.hour.value = xx(h);
        task.minute.value = xx(m);
        task.second.value = xx(s);
        title.innerText = `${task.hour.value}:${task.minute.value}:${task.second.value}`;
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
    return String(num).padStart(2, "0");
}

let pattern = /.*v=(\w+).*/;
function playVideoFromUrl() {
    let video = html.config.video;
    let url = video.input.value;
    let videoId = url !== '' ? url.match(pattern)[1] : null;
    let embeddedUrl = videoId ? `//www.youtube.com/embed/${videoId}?rel=0&autoplay=1` : null;
    if (embeddedUrl) {
        video.player.setAttribute('src', embeddedUrl);
    }
}

function stopVideo() {
    html.config.video.player.setAttribute('src', 'about:blank');
}