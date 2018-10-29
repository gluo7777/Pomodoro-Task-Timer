'use strict';

// Backend for interacting with Google's Task API to retrieve tasks and update their status
// internal
const AUTH_PARAMS = {
    'apiKey': 'AIzaSyCP_mc3deMxo-efwwE_5bQK2ONnC6UbFfU',
    'clientId': '425304648954-b38cldabmopkds1loegli1tlmb658st1.apps.googleusercontent.com',
    'scope': 'https://www.googleapis.com/auth/tasks',
    'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest']
}, TASK_LIST_REQUEST_PARAMS = {
    'maxResults': 99
};
// application state
let gauth;
let isAuthorized;

function initializeAPI() {
    gapi.load('client:auth2', function () {
        gapi.client.init(AUTH_PARAMS).then(function () {
            console.log('initializing client..');
            gauth = gapi.auth2.getAuthInstance(AUTH_PARAMS);
            isAuthorized = gauth ? true : false;
            gauth.isSignedIn.listen(notifySigninStatusChange);
        });
    });
}

/**
 * Update application state when authenticated status changes
 * @param {status} params 
 */
function notifySigninStatusChange(params) {
    console.log('sign in status changed: %s', params);
    isAuthorized = params;
}

class Task {
    constructor() {
    }
    list(name, id) {
        this.listName = name;
        this.listId = id;
        return this;
    }
    task(name, id) {
        this.taskName = name;
        this.taskId = id;
        return this;
    }
    notes(notes) {
        this.notes = notes;
        return this;
    }
}

function login() {
    gauth.signIn();
    isAuthorized = true;
}

function logout(params) {
    gauth.disconnect();
    isAuthorized = false;
}

/**
 * @todo For testing only
 */
function listTaskLists(tasksHandler) {
    if (isAuthorized) {
        gapi.client.tasks.tasklists.list(TASK_LIST_REQUEST_PARAMS)
            .then(function (response) {
                if (response.status === '200') {
                    var taskLists = response.result.items;
                    if (taskLists && taskLists.length > 0) {
                        for (var i = 0; i < taskLists.length; i++) {
                            var taskList = taskLists[i];
                            listTasksForList(taskLists[i], tasksHandler);
                        }
                    } else {
                        console.log('No task lists found.');
                    }
                }
            });
    }
}

/**
 * @todo For testing only
 */
function listTasksForList(taskList, tasksHandler) {
    let requestParams = {
        'tasklist': taskList.id
    };
    gapi.client.tasks.tasks.list(requestParams).then(
        function handleResponse(response) {
            if (response.status === '200') {
                var tasks = response.result.items;
                if (tasks && tasks.length > 0) {
                    for (var i = 0; i < tasks.length; i++) {
                        let task = tasks[i];
                        let taskItem = new Task().list(taskList.title, taskList.id)
                            .task(task.title, task.id).notes(task.notes);
                        tasksHandler(taskItem);
                    }
                }
            }
        }
    );
}