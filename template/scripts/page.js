/**
 * Loads DOM elements into re-usable Javascript objects.
 * Note: ONLY PUT NON-REPLACEABLE ELEMENTS HERE.
 * Note: DO NOT CLONE ANY OF THESE ELEMENTS.
 */

let page = (function (params) {
    // Initialize timer column
    let timer = document.querySelector('.timer-column');
    timer.control = document.querySelector('.timer-column>.control-panel');
    //// todo: add buttons

    timer.list = document.querySelector(".task-list");
    //// helper functions
    timer.list.getFirstTask = function () {
        let task = timer.list.querySelector(".task");
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
    let config = document.querySelector('.config-column');
    config.tab = config.querySelector('.tab');
    config.tab.video = config.tab.querySelector('#open-video-panel');
    config.tab.import = config.tab.querySelector('#open-imported-task-panel');
    config.tab.setting = config.tab.querySelector('#open-settings-panel');
    config.video = config.querySelector('#video-panel');
    config.video.control = config.video.querySelector('.video-panel');
    config.video.input = config.video.querySelector('input');
    config.video.player = config.video.querySelector('.video');
    // todo: add buttons
    config.import = document.querySelector('#imported-task-panel');
    config.import.select = config.import.querySelector('#list-selector>select');
    config.import.list = config.import.querySelector('.imported-task-list');
    return {
        /**
         * preconditions: DOM completely loaded
         * Call and store return value after DOM has loaded.
         */
        loadDomElements: function () {
            return {
                // General
                title: document.querySelector('title'),
                timer: timer,
                config: config
            };
        }
    }
})();