"use strict"; //newer and stricter standards when running our code
//function constructor so DOM can be ready.
function ChecklistApp() {
    var version = " v1.3",
    appStorage = new AppStorage("Checklist");

    function setStatus(message) {
        $("#app>footer").text(message); //$ is an alias for the jQuery object
    }

    function saveTaskList() {
        var tasks = [];
        $("#task-list .task span.task-name").each(function () {
            tasks.push($(this).text())
        });
        appStorage.setValue("taskList", tasks);
    }

    function addTask() {
        var taskName = $("#new-task-name").val(); // jQuery's val() method is used to get the value of input fields.
        if (taskName) {
            addTaskElement(taskName); // runs the function addTaskElement 
            $("#new-task-name").val("").focus(); // Reset the text field to blank ("")
            saveTaskList();
        }
    }

    function addTaskElement(taskName) {
        //All we have to do is get the template element and use the clone() method to make a copy of it.
        var $task = $("#task-template .task").clone();
        //The second line fills the task name into the <span class="task-name"> element we have set up to hold it. 
        $("span.task-name", $task).text(taskName); //second argument tells jQuery to only search for elements that are descendants of the task element.

        $("#task-list").append($task);

        //Button event
        $("button.delete", $task).click(function () {
            removeTask($task);
        });
        $("button.move-up", $task).click(function () {
            moveTask($task, true);
        });
        $("button.move-down", $task).click(function () {
            moveTask($task, false);
        });

        // Task name events
        $("span.task-name", $task).click(function () {
            onEditTaskName($(this));
        });
        $("input.task-name", $task).change(function () {
                onChangeTaskName($(this));
            })
            .blur(function () {
                $(this).hide().siblings("span.task-name").show();
            });
    }

    function removeTask($task) {
        $task.remove();
        saveTaskList();
    }

    function moveTask($task, moveUp) {
        if (moveUp) {
            $task.insertBefore($task.prev());
        } else {
            $task.insertAfter($task.next());
        }
        saveTaskList();
    }

    function onEditTaskName($span) {
        $span.hide()
            .siblings("input.task-name").val($span.text()).show().focus();
    }

    function onChangeTaskName($input) {
        $input.hide();
        var $span = $input.siblings("span.task-name");
        if ($input.val()) {
            $span.text($input.val());
            saveTaskList();
        }
        $span.show();
    }

    function loadTaskList() {
        var tasks = appStorage.getValue("taskList");
        if (tasks) {
            for (var i in tasks) {
                addTaskElement(tasks[i]);
            }
        }
    }

    this.start = function () {
        $("#new-task-name").keypress(function (e) { //we get the text field by doing a jQuery select on its ID, new-task-name
                if (e.which == 13) // if the user pressed the Enter key
                {
                    addTask(); //call addTask()
                    return false; //we return false here is to tell the system that we handled the key press event
                }
            })
            .focus();

        $("#app>header").append(version);
        loadTaskList();
        setStatus("ready");
    };
}

$(function () {
    window.app = new ChecklistApp();
    window.app.start();
});