// For config-panel interactivity

let config;

document.addEventListener('DOMContentLoaded', function (event) {
    config = page.loadDomElements().config;
    // initialize conig panel tabs
    config.tab.video.addEventListener('click', (e) => displayTab('video-panel'));
    config.tab.import.addEventListener('click', (e) => displayTab('imported-task-panel'));
    // initialize list selector
    const selectList = config.import.select;
    selectList.addEventListener('change', event => {
        // get name of selected option
        const listId = getListId(event.target.selectedOptions[0]);
        // hide unhidden tasks
        for (const task of config.import.list.querySelectorAll('.imported-task.active-task')) {
            task.classList.remove('active-task');
        }
        // unhide tasks in selected list
        for (const task of config.import.list.querySelectorAll(`.imported-task[data-task-list-id=${listId}]`)) {
            task.classList.add('active-task');
        }
    });
    // initialize Google OAuth2 services and set handlers
    //// add handling of each list name
    taskapi.setListHandler(function (list) {
        let option = document.createElement('option');
        option.value = list.title;
        option.innerText = list.title;
        setListId(option, list.id);
        selectList.options.add(option);
    });
    //// add handling of each imported task
    taskapi.setTaskHandler(function addTaskToDisplay(task) {
        // add task list to select if not already there
        // instantiate template and use task to populate it
        let template = factory.importedTask();
        template.list.value = task.listName;
        setListId(template, task.listId);
        template.task.value = task.taskName;
        setTaskId(template, task.taskId);
        template.description.value = task.notes ? task.notes : '';
        // set eventListeners
        template.move.addEventListener('click', e => {
            let newTask = addTask();
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

//// Import Panel ////
function importTasks() {
    let importPanel = config.import;
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

let pattern = /.*v=(\w+).*/;
function playVideoFromUrl() {
    let video = config.video;
    let url = video.input.value;
    let videoId = url !== '' ? url.match(pattern)[1] : null;
    let embeddedUrl = videoId ? `//www.youtube.com/embed/${videoId}?rel=0&autoplay=1` : null;
    if (embeddedUrl) {
        video.player.setAttribute('src', embeddedUrl);
    }
}

function stopVideo() {
    config.video.player.setAttribute('src', 'about:blank');
}

// Attributes
const LIST_ID = 'data-task-list-id';
const TASK_ID = 'data-task-id';

function setListId(node, listId) {
    node.setAttribute(LIST_ID, String(listId));
}

function setTaskId(node, taskId) {
    node.setAttribute(TASK_ID, String(taskId));
}

function getListId(node) {
    return node.getAttribute(LIST_ID);
}

function getTaskId(node) {
    return node.getAttribute(TASK_ID);
}