const factory = (function () {
    // templates
    const template = document.querySelector('#task-template').content;
    template.timerTask = template.querySelector('.task');
    template.importedTask = template.querySelector('.imported-task');
    return {
        timerTask: function () {
            const temp = template.timerTask.cloneNode(true);
            // set helper attributes
            temp.hours = temp.querySelector('.hours');
            temp.minutes = temp.querySelector('.minutes');
            temp.seconds = temp.querySelector('.seconds');
            temp.label = temp.querySelector('.task-label>input');
            // buttons
            temp.up = temp.querySelector('.up.btn');
            temp.down = temp.querySelector('.down.btn');
            temp.delete = temp.querySelector('.delete.btn');
            // functions
            temp.getTimeInputs = function () {
                return [temp.hours, temp.minutes, temp.seconds];
            }
            temp.setTaskId = function (taskId) {
                temp.setAttribute(TASK_ID, String(taskId));
            };
            return temp;
        },
        importedTask: function () {
            const temp = template.importedTask.cloneNode(true);
            // set helper attributes
            temp.list = temp.querySelector('#list');
            temp.task = temp.querySelector('#task');
            temp.description = temp.querySelector('#description');
            temp.move = temp.querySelector('#addToTaskList');
            temp.delete = temp.querySelector('#removeFromImportList');
            return temp;
        }
    }
})();