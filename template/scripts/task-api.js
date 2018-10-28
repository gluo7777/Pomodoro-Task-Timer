'use strict';

// Backend for interacting with Google's Task API to retrieve tasks and update their status
// internal
const AUTH_PARAMS = {
    'apiKey': 'AIzaSyCP_mc3deMxo-efwwE_5bQK2ONnC6UbFfU',
    'clientId': '425304648954-b38cldabmopkds1loegli1tlmb658st1.apps.googleusercontent.com',
    'scope': 'https://www.googleapis.com/auth/tasks',
    'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest']
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

/**
 * @todo For testing only
 */
function listTaskLists() {
    if (isAuthorized) {
        gapi.client.tasks.tasklists.list({
            'maxResults': 99
        }).then(function (response) {
            console.log('Task Lists:');
            var taskLists = response.result.items;
            if (taskLists && taskLists.length > 0) {
                for (var i = 0; i < taskLists.length; i++) {
                    var taskList = taskLists[i];
                    console.log(taskList.title + ' (' + taskList.id + ')');
                    console.log(`Listing tasks for ${taskList.id}:`);
                    listTasksForList(taskList.id);
                }
            } else {
                console.log('No task lists found.');
            }
        });
    }
}

/**
 * @todo For testing only
 */
function listTasksForList(listId) {
    let requestParams = {
        'tasklist': listId
    };
    gapi.client.tasks.tasks.list(requestParams).then(
        function handleResponse(response) {
            var tasks = response.result.items;
            if (tasks && tasks.length > 0) {
                for (var i = 0; i < tasks.length; i++) {
                    let task = tasks[i];
                    console.log(`Title: ${task.title}`
                        + `\nDescription: ${task.notes ? task.notes : ''}`
                        + `\nStatus: ${task.status === 'needsAction' ? 'active' : 'completed'}`
                        + `\nId: ${task.id}`
                    );
                }
            }

        }
    );
}