'use strict';

// Backend for interacting with Google's Task API to retrieve tasks and update their status
var taskapi = (function () {
    // application state
    let isAuthorized = false;
    // internal constants
    const AUTH_PARAMS = {
        'apiKey': 'AIzaSyCP_mc3deMxo-efwwE_5bQK2ONnC6UbFfU',
        'clientId': '425304648954-b38cldabmopkds1loegli1tlmb658st1.apps.googleusercontent.com',
        'scope': 'https://www.googleapis.com/auth/tasks',
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest']
    }, TASK_LIST_REQUEST_PARAMS = {
        'maxResults': 99
    };
    // handlers to be overridden
    let handler = {
        /**
         * Required.
         * @param {*} taskList 
         */
        list: function (taskList) {
            throw `${handler.task} is not defined.`;
        },
        /**
         * Required.
         * @param {*} task 
         */
        task: function (task) {
            throw `${handler.task} is not defined.`;
        },
        /** 
         * Default: Only logs message.
         * @param {sign in status} status 
         */
        signin: function (status) {
            console.log('sign in status changed: %s', status);
        }
    };
    // internal functions
    /**
     * Update application state when authenticated status changes.
     * calls signInHandler
     * @param {status} params 
     */
    function notifySigninStatusChange(status) {
        isAuthorized = status;
        handler.signin(isAuthorized);
    }
    /**
     * @todo add error handling
     * @param {gtasklist object} taskList 
     */
    function listTasksForList(taskList) {
        let requestParams = {
            'tasklist': taskList.id
        };
        gapi.client.tasks.tasks.list(requestParams).then(function handleResponse(response) {
            if (response.status === 200) {
                var tasks = response.result.items;
                if (tasks && tasks.length > 0) {
                    for (var i = 0; i < tasks.length; i++) {
                        let task = tasks[i];
                        let taskItem = new Task().list(taskList.title, taskList.id)
                            .task(task.title, task.id).notes(task.notes);
                        handler.task(taskItem);
                    }
                }
            } else {
                console.log(`Error retrieving tasks for "${taskList.title}"`);
            }
        }).catch(error => console.error(error));
    }
    // expose methods for task back end
    return {
        // setters for handlers
        setListHandler: function (h) {
            handler.list = h;
        },
        setTaskHandler: function (h) {
            handler.task = h;
        },
        setSignInHandler: function (h) {
            handler.signin = h;
        },
        /**
         * Loads and initializes google's oauth2 client.
         * Adds handlers to handle sign-state change
         */
        initializeAPI: function () {
            gapi.load('client:auth2', function () {
                gapi.client.init(AUTH_PARAMS).then(function () {
                    console.log('initializing client..');
                    let gauth = gapi.auth2.getAuthInstance(AUTH_PARAMS);
                    // isAuthorized = gauth ? true : false;
                    gauth.isSignedIn.listen(notifySigninStatusChange);
                    notifySigninStatusChange(gauth.isSignedIn.get());
                });
            });
        },
        login: function () {
            gapi.auth2.getAuthInstance(AUTH_PARAMS).signIn();
            isAuthorized = true;
        },
        logout: function () {
            gapi.auth2.getAuthInstance(AUTH_PARAMS).disconnect();
            isAuthorized = false;
        },
        listTaskLists: function () {
            gapi.client.tasks.tasklists
                .list(TASK_LIST_REQUEST_PARAMS)
                .then(function (response) {
                    if (response.status === 200) {
                        var taskLists = response.result.items;
                        if (taskLists && taskLists.length > 0) {
                            for (var i = 0; i < taskLists.length; i++) {
                                var taskList = taskLists[i];
                                handler.list(taskList);
                                listTasksForList(taskLists[i]);
                            }
                        } else {
                            console.log('No task lists found.');
                        }
                    }
                }).catch(error => console.error(error));
        },
        authorized: function () {
            return isAuthorized;
        }
    };
})();


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