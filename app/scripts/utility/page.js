/**
 * Loads DOM elements into re-usable Javascript objects.
 * Note: ONLY PUT NON-REPLACEABLE ELEMENTS HERE.
 * Note: DO NOT CLONE ANY OF THESE ELEMENTS.
 */

// constants
const DATA = {
    LIST_ID: 'data-task-list-id',
    TASK_ID: 'data-task-id'
};
// Page Module
// Initialize timer column
const timer = document.querySelector('#timer-column');
timer.control = timer.querySelector('.control-panel');
//// todo: add buttons
timer.control.start = timer.control.querySelector('#start');
timer.control.stop = timer.control.querySelector('#stop');
timer.control.reset = timer.control.querySelector('#reset');
timer.control.select = timer.control.querySelector('#select');
timer.control.add = timer.control.querySelector('#addTask');
timer.list = timer.querySelector("#timer-list");
//// helper functions
timer.list.getFirstTask = function () {
    const task = timer.list.querySelector(".task");
    if (task) {
        return {
            task: task,
            hour: task.querySelector(".hours"),
            minute: task.querySelector(".minutes"),
            second: task.querySelector(".seconds"),
            label: task.querySelector(".task-label>input")
        };
    } else { return null; }
};

// Initialize config column
const config = document.querySelector('#config-column');
config.tab = config.querySelector('.tab');
config.tab.clearActive = function () {
    config.tab.querySelector('.tablinks.active').classList.remove('active');
    config.querySelector('.panel.active').classList.remove('active');
};
config.tab.setActive = function (tab) {
    tab.classList.add('active');
    config.querySelector(`#${tab.getAttribute('data-panel-id')}`).classList.add('active');
};
config.tab.video = config.tab.querySelector('#open-video-panel');
config.tab.import = config.tab.querySelector('#open-imported-task-panel');
config.tab.setting = config.tab.querySelector('#open-settings-panel');
config.tab.getAllTabs = function () {
    return config.tab.querySelectorAll('.tablinks');
};
config.video = config.querySelector('#video-panel');
config.video.control = config.video.querySelector('.video-panel');
config.video.input = config.video.querySelector('input');
config.video.player = config.video.querySelector('.video');
config.import = document.querySelector('#imported-task-panel');
config.import.control = config.import.querySelector('.control-panel');
config.import.control.sync = config.import.control.querySelector('#sync');
config.import.control.switch = config.import.control.querySelector('#accounts');
config.import.control.select = config.import.control.querySelector('#selectImportedTasks');
config.import.select = config.import.querySelector('#list-selector>select');
config.import.select.getSelected = function () {
    return config.import.select.selectedOptions[0].getAttribute(DATA.LIST_ID);
};
config.import.list = config.import.querySelector('#imported-task-list');
config.import.list.clearActive = function () {
    for (const task of config.import.list.querySelectorAll('.imported-task.active-task')) {
        task.classList.remove('active-task');
    }
};
config.import.list.setActive = function (listId) {
    for (const task of config.import.list.querySelectorAll(`.imported-task[${DATA.LIST_ID}=${listId}]`)) {
        task.classList.add('active-task');
    }
};

// Initialize Setting Panel
const setting = document.querySelector('#settings-panel');
setting.config = {
    timer: setting.querySelector("#timer-settings")
};
setting.control = setting.querySelector('.control-panel');
setting.control.save = setting.control.querySelector('#saveSettings');
setting.control.reset = setting.control.querySelector('#resetSettings');

// Initialize Main Elements
const title = document.querySelector('title');
const defaultTitle = title.innerText;
title.reset = function () {
    title.innerText = defaultTitle;
};

export { timer, config, setting, title, DATA };