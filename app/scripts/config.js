// For config-panel interactivity

import {saveToStorage,getFromStorage} from './utility/storage.js';
import {config, DATA} from './utility/page.js';
import {importedTask} from './utility/template.js';
import * as timerapi from './timer.js';
import * as taskapi from './api/task-api.js';

document.addEventListener('DOMContentLoaded', function () {
    // tab control
    for(const tab of config.tab.getAllTabs()){
        tab.addEventListener('click', e => {
            config.tab.clearActive();
            config.tab.setActive(e.target);
        });
    };
    // initialize list selector
    const selectList = config.import.select;
    selectList.addEventListener('change', event => {
        // get name of selected option
        const listId = selectList.getSelected();
        // hide unhidden tasks
        config.import.list.clearActive();
        // unhide tasks in selected list
        config.import.list.setActive(listId);
    });
    // initialize Google OAuth2 services and set handlers
    //// add handling of each list name
    taskapi.setListHandler(function (list) {
        const option = document.createElement('option');
        option.value = list.title;
        option.innerText = list.title;
        setListId(option, list.id);
        selectList.options.add(option);
    });
    //// add handling of each imported task
    taskapi.setTaskHandler(function addTaskToDisplay(task) {
        // add task list to select if not already there
        // instantiate template and use task to populate it
        const template = importedTask();
        template.list.value = task.listName;
        setListId(template, task.listId);
        template.task.value = task.taskName;
        setTaskId(template, task.taskId);
        template.description.value = task.notes ? task.notes : '';
        // set eventListeners
        template.move.addEventListener('click', e => {
            const newTask = timerapi.addTask();
            newTask.label.value = `[${task.listName}] ${task.taskName}`;
            config.import.list.removeChild(template);
        });
        template.delete.addEventListener('click', e => {
            config.import.list.removeChild(template);
        });
        // unhide if list name matches selected list
        if (task.listId === getListId(config.import.select.selectedOptions[0])) {
            template.classList.add('active-task');
        }
        // then add it to import-task-list
        config.import.list.appendChild(template);
    });
    // set sign in action
    taskapi.setSignInHandler(function (signedIn) {
        if (signedIn) {
            importTasks();
        }
    });
    taskapi.initializeAPI();
    // add events for Import Panel buttons
    const importControl = config.import.control;
    importControl.sync.addEventListener('click', importTasks);
    importControl.switch.addEventListener('click', switchAccounts);
    importControl.select.addEventListener('click', event => console.log('This has not been implemented yet.'));

    // add listeners for video panel
    const VIDEO_URL_KEY = 'youtube_video';
    config.video.input.addEventListener('focusout', e => {
        saveToStorage(VIDEO_URL_KEY, e.target.value);
    });

    // retrieve from local storage
    config.video.input.value = getFromStorage(VIDEO_URL_KEY);
});

//// Import Panel ////
function importTasks() {
    const importPanel = config.import;
    // reset select list
    const selectList = importPanel.select;
    while (selectList.childElementCount > 0) {
        selectList.removeChild(selectList.firstChild);
    }
    // reset list of imported tasks
    const importList = importPanel.list;
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

function setListId(node, listId) {
    node.setAttribute(DATA.LIST_ID, String(listId));
}

function setTaskId(node, taskId) {
    node.setAttribute(DATA.TASK_ID, String(taskId));
}

function getListId(node) {
    return node.getAttribute(DATA.LIST_ID);
}

function getTaskId(node) {
    return node.getAttribute(DATA.TASK_ID);
}