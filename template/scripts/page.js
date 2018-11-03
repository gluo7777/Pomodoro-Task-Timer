/**
 * Loads DOM elements into re-usable Javascript objects.
 * Note: ONLY PUT NON-REPLACEABLE ELEMENTS HERE.
 * Note: DO NOT CLONE ANY OF THESE ELEMENTS.
 */

var page = (function (params) {
    // Initialize timer column
    let timer = document.querySelector('.timer-column');
    timer.control = document.querySelector('.timer-column>.control-panel');
    // todo: add buttons
    timer.list = document.querySelector(".task-list");

    // Initialize config column
    let config = document.querySelector('.config-column');
    config.tab = document.querySelector('.config-column>.tab');
    config.video = document.querySelector('#video-panel');
    config.video.control = document.querySelector('#video-panel>.video-panel');
    config.video.input = document.querySelector('#video-panel>*>input');
    config.video.player = document.querySelector('#video-panel>.video');
    // todo: add buttons
    config.import = document.querySelector('#imported-task-panel');
    config.import.select = document.querySelector('#list-selector');
    config.import.list = document.querySelector('#imported-task-panel>.imported-task-list');
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