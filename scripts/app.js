"use strict";

// const { Temporal } = require("@js-temporal/polyfill");

const taskManager = {
    _tasks: [],

    get tasks() {
        return this._tasks;
    },
    set tasks(newTasks) {
        this._tasks = newTasks;
        this.updateTaskCountDisplay();
    },
    get totalCount() {
        return this._tasks.length;
    },
    updateTaskCountDisplay() {
        const countText = this.totalCount ? `Total Tasks: ${this.totalCount}` : "Total Tasks: No Tasks";
        document.getElementById("total-task-count").innerText = countText;
    }
}

// let tasks = taskManager.tasks;
const reminders = [];
const deletedTask = [];
let currentEditTaskId = null;

// setting and getting Data from Local Storage 
const saveTasksToLocalStorage = () => {
    console.log("Saving tasks to localStorage:", taskManager.tasks);
    localStorage.setItem("tasks", JSON.stringify(taskManager.tasks));
}

const saveDeletedTasksToLocalStorage = (task) => {
    deletedTask.push(task);
    localStorage.setItem("deleted", JSON.stringify(deletedTask));
}

const loadDeletedTasksFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem("deleted")) || [];
}

// simply load data 
const loadTasksFromLocalStorage = () => {
    try {
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks) {
            taskManager.tasks = JSON.parse(savedTasks);
        }
    } catch (err) {
        // manually throw error
        throw err;
    }

}

// load task using callback function
const loadTasksWithCallback = (callback) => {
    try {
        const savedTasks = localStorage.getItem("tasks");

        if (savedTasks) {
            taskManager.tasks = JSON.parse(savedTasks);
        }
        callback(null, taskManager.tasks);
    } catch (error) {
        callback(error);
    }
}

// load task using promices rsolve/reject
const loadTasksWithPromise = () => {
    return new Promise((resolve, reject) => {
        try {
            const savedTasks = localStorage.getItem("tasks");
            if (savedTasks) {
                taskManager.tasks = JSON.parse(savedTasks);
            }
            resolve(taskManager.tasks);
        } catch (error) {
            reject(error);
        }
    });
}

// Load data using async/await
const loadTasksAsync = async () => {
    try {
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks) {
            taskManager.tasks = JSON.parse(savedTasks);
        }
        return taskManager.tasks;
    } catch (error) {
        throw error;
    }
}

// closure : undo deleted task 

const UndoManager = (() => {
    let deleted = JSON.parse(localStorage.getItem("deleted"));
    return {
        undoDelete() {
            if (deleted.length === 0){
                return null;
            } 
            const lastDeleted = deleted.pop();
            localStorage.setItem("deleted", JSON.stringify(deleted));
            return lastDeleted;
        }
    };
})();

// uodate count using Call method
const fakeTaskManager = {
    _tasks: [1, 2, 3, 4, 5],
    get totalCount() {
        return this._tasks.length;
    }
};


// add some sample task using apply method
const addTasks = (...newTasks) => {
    if (!taskManager.tasks) {
        taskManager.tasks = loadTasksFromLocalStorage();
    }
    taskManager.tasks = [...taskManager.tasks, ...newTasks];
    saveTasksToLocalStorage();
}

// use apply to pass multiple tasks
const tasksToAdd = [
    { id: Date.now(), title: "Bulk 2", date: "2025-04-16", priority: "low", category: "work", completed: false },
    { id: Date.now() + 1, title: "Bulk 3", date: "2025-04-16", priority: "high", category: "personal", completed: false }
];

// addTasks.apply(null, tasksToAdd);

// Display sample task using bind
const displaySampleTask = () => {
    const taskList = document.getElementById("Due-task-today");
    if (!taskList) {
        console.error('Task list element not found.');
        return;
    }
    const taskItem = document.createElement("div");
    taskItem.className = "p-3 border border-gray-300";
    taskItem.innerText = `Task: ${this.title} | Priority: ${this.description}`;
    taskList.appendChild(taskItem);
}

// now bind it to a task and call
const someTask = { title: "Sample Task", description: "Hurray No Upcoming Deadline" };
const boundDisplay = displaySampleTask.bind(someTask);


// show and hide popup to add new task

const showAddTaskForm = () => {
    document.getElementById("add-task-form").style.display = "block"
}

const closeAddTaskWindow = () => {
    document.getElementById("add-task-form").style.display = "none"
}

// Reminder Task that are Due Today
function ReminderDueTask(id, title, message) {
    this.id = id;
    this.title = title;
    this.message = message;
}
ReminderDueTask.prototype.remainingTime = "Less Then 6 Hours"

const dueTodayTask = () => {

    let currentTime = Date.now();
    let message = "";
    taskManager.tasks.forEach((task) => {
        const taskTime = new Date(task.date).getTime();
        if (!task.completed && taskTime - currentTime <= 20000000) {
            const reminder = new ReminderDueTask(task.id, task.title, message);
            reminder.message = `Reminder: Task "${task.title}" is due soon! </br> Remaining Time is ${reminder.remainingTime}`;
            reminders.push(reminder);
        }
    })
    if (reminders.length <= 0) {
        boundDisplay();
    }
    displayDuetaskToday();
}

const displayDuetaskToday = () => {
    const taskList = document.getElementById("Due-task-today");
    taskList.innerHTML = "";
    const DueTodayTaskHeader = document.createElement("h2");
    DueTodayTaskHeader.className = "text-lg font-bold  p-3 mt-6 mb-2";
    DueTodayTaskHeader.innerHTML = `
    <h2 class="text-md  text-red-600 flex items-center gap-2">
        Deadline Alert!
    </h2>   
    <p class="text-sm text-gray-700 mt-1">You have tasks due today. Don't miss them!</p>
`;
    taskList.appendChild(DueTodayTaskHeader);

    reminders.forEach((task) => {
        if (!task.completed) {
            const taskItem = document.createElement("div");
            taskItem.className = "text-gray-800 flex justify-around gap-4 items-center p-3 border-b border-gray-300";
            taskItem.innerHTML = `
                <h4 class="w-1/6 font-semibold break-words">${task.title}</h4>
                <p class="w-1/6 break-words">${task.message}</p>
            `;
            taskList.appendChild(taskItem);
        }
    })
}

// Sorting Functions
const sortByDate = () => {
    taskManager.tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    saveTasksToLocalStorage();
    window.location.reload();
}

const sortByPriority = () => {
    const priorityOrder = {
        high: 1,
        medium: 2,
        low: 3
    }
    taskManager.tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    saveTasksToLocalStorage();
    window.location.reload();
}

const sortByCategoryFun = () => {
    return Map.groupBy(taskManager.tasks, task => task.category);
}

// Updata Task
const updateTask = (id) => {
    const task = taskManager.tasks.find(t => t.id === id);
    if (!task) return;
    showAddTaskForm();
    currentEditTaskId = id;
    document.getElementById("task-title").value = task.title;
    document.getElementById("task-description").value = task.description;
    document.getElementById("task-date").value = task.date;
    document.getElementById("task-priority").value = task.priority;
    document.getElementById("task-category").value = task.category;
    const addTaskButton = document.getElementById("task-submit-button")
    addTaskButton.innerText = "Update Task";
}

// Display Task on Grouped Categories
const displayGroupedTasks = () => {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";
    const groupedTasks = sortByCategoryFun();

    for (const [category, categoryTasks] of groupedTasks) {
        console.log("Key-category:", category)
        console.log("Key-categoryTasks:", categoryTasks)
        const categoryHeader = document.createElement("h2");
        categoryHeader.className = "text-lg font-bold text-blue-600 mt-6 mb-2";
        categoryHeader.innerText = category.toUpperCase();
        taskList.appendChild(categoryHeader);

        categoryTasks.forEach(task => {
            if (!task.completed) {
                const taskItem = document.createElement("div");
                taskItem.className = "text-gray-800 flex justify-around gap-4 items-center p-3 border-b border-gray-300";
                taskItem.innerHTML = `
                    <h4 class="w-1/6 font-semibold break-words">${task.title}</h4>
                    <p class="w-1/6 break-words">${task.description}</p>
                    <span class="w-1/6">${task.date}</span>
                    <span class="w-1/6 capitalize">${task.priority}</span>
                    <span class="w-1/6 capitalize">${task.category}</span>
                    <span class="w-1/6 flex gap-3 justify-center items-center">
                        <span>${task.completed ? "Done" : "Pending"}</span>
                        <div class="text-xs flex flex-col gap-1">
                            <button class="cursor-pointer bg-blue-500 text-white rounded-md px-2 py-1 hover:opacity-70" onclick="updateTask(${task.id})">Update</button>
                            <button class="cursor-pointer bg-red-500 text-white rounded-md px-2 py-1 hover:opacity-70" onclick="deleteTask(${task.id})">Delete</button>
                            <button class="cursor-pointer bg-blue-600 text-white rounded-md px-2 py-1 hover:opacity-70" onclick="taskCompleted(${task.id})">Task Complete</button>
                        </div>
                    </span>
                `;
                taskList.appendChild(taskItem);
            }
        });
    }
};

// Delete Task
const deleteTask = (id) => {
    try {
        const taskToDelete = taskManager.tasks.find(task => task.id === id);
        if (taskToDelete) {
            saveDeletedTasksToLocalStorage(taskToDelete);
            taskManager.tasks = taskManager.tasks.filter(task => task.id !== id);
            saveTasksToLocalStorage();
            window.location.reload();
        }
    }
    catch (e) {
        console.log("Internal Server Error:", e)
    }
}
const undoDeleteTask = () => {
    const lastDeletedTask = UndoManager.undoDelete();
    if (lastDeletedTask) {
        taskManager.tasks = [...taskManager.tasks, lastDeletedTask];
        saveTasksToLocalStorage();
        alert(`Task "${lastDeletedTask.title}" has been restored.`);
        window.location.reload();
    } else {
        alert("No task to undo.");
    }
};


// Mark Task As Completed
const taskCompleted = (id) => {
    try {
        const task = taskManager.tasks.find(task => task.id === id);
        if (task) {
            task.completed = true
            saveTasksToLocalStorage();
            displayHistory();
            window.location.reload();
        }
    } catch (e) {
        console.log("Internal Server Error:", e)
    }
}

// fetching & saving task data
const SubmitFormData = () => {
    try {
        const taskTitle = document.getElementById("task-title").value.trim();
        const taskDescription = document.getElementById("task-description").value.trim();
        const taskDate = document.getElementById("task-date").value;
        const taskPriority = document.getElementById("task-priority").value;
        const taskCategory = document.getElementById("task-category").value;
        const taskAddedPopup = document.getElementById("task-added-popup");
        const addTaskButton = document.getElementById("task-submit-button");

        if (!taskTitle || !taskDate) {
            alert("Title and due date are required.");
            return;
        }
        addTaskButton.innerText = currentEditTaskId ? "Updating..." : "Saving...";

        if (currentEditTaskId) {
            // UPDATE mode
            const task = taskManager.tasks.find(t => t.id === currentEditTaskId);
            if (task) {
                task.title = taskTitle;
                task.description = taskDescription;
                task.date = taskDate;
                task.priority = taskPriority;
                task.category = taskCategory;
            }
        } else {
            // ADD mode
            const taskTitles = new Set(taskManager.tasks.map(task => task.title.toLowerCase()));
            if (taskTitles.has(taskTitle.toLowerCase())) {
                alert("A task with this title already exists!");
                return;
            }

            const containsOnlyValidChars = (str) => {
                return /^[a-zA-Z0-9_ ]*$/.test(str);
            };


            if (!containsOnlyValidChars(taskTitle)) {
                alert("Task title should only contain letters, numbers, underscores, or spaces.");
                return;
            }

            const task = {
                id: Date.now(),
                title: taskTitle,
                description: taskDescription,
                date: taskDate,
            };

            const taskDetail = {
                priority: taskPriority,
                category: taskCategory,
                completed: false
            }

            // Copies properties form obj2 to obj1
            Object.assign(task, taskDetail)

            // make id property only readable
            Object.defineProperty(task, "id", {
                writable: false,     // cannot change value
                enumerable: true,    // shows up in loops
                configurable: false  // can't delete or modify descriptor
            })

            // Prevent Extension
            Object.preventExtensions(task)

            Object.freeze(task)

            // console.log("Object properties:",Object.getOwnPropertyDescriptor(task,id))

            taskManager.tasks = [...taskManager.tasks, task];
        }
        saveTasksToLocalStorage();
        taskAddedPopup.style.display = "block";
        setTimeout(() => {
            closeAddTaskWindow();
            taskAddedPopup.style.display = "none";
            document.getElementById("taskForm").reset();
            currentEditTaskId = null;
            // window.location.reload();
        }, 900);
    } catch (e) {
        console.log("Internal Server Error in submiting form data:", e);
    }
    finally {
        addTaskButton.innerText = "Save Task";
    }
}

// Display Task's that are to be Completed 
const displayTaskData = () => {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";
    try {
        taskManager.tasks.forEach(task => {
            if (!task.completed) {
                const taskItem = document.createElement("div");
                taskItem.className = "text-gray-800 flex justify-around gap-4 items-center p-3 border-b last:border-0 border-gray-300";
                taskItem.innerHTML = `
                    <h4 class="w-1/6 font-semibold break-words">${task.title}</h4>
                    <p class="w-1/6 break-words">${task.description}</p>
                    <span class="w-1/6">${task.date}</span>
                    <span class="w-1/6 capitalize">${task.priority}</span>
                    <span class="w-1/6 capitalize">${task.category}</span>
                    <span class="w-1/6 flex gap-3 justify-center items-center">
                        <span class="">${task.completed ? "Done" : "Pending"}</span>
                        <div class="text-xs flex flex-col gap-1">
                            <button class="cursor-pointer bg-blue-500 text-white rounded-md w-max px-2 py-1 hover:opacity-70" onclick="updateTask(${task.id})">Update</button>
                            <button class="cursor-pointer bg-red-500 text-white rounded-md w-max px-2 py-1 hover:opacity-70" onclick="deleteTask(${task.id})">Delete</button>
                            <button class="cursor-pointer bg-blue-600 text-white rounded-md w-max px-2 py-1 hover:opacity-70" onclick="taskCompleted(${task.id})">Task Complete</button>
                        </div>
                    </span>
                `;
                taskList.appendChild(taskItem);
            }
        });
    } catch (e) {
        console.log("Error while displaying Task Data:", e);
    }
}

// Display Completed task's
const displayHistory = function () {
    const taskHistory = document.getElementById("task-history");
    try {
        taskManager.tasks.forEach(task => {
            if (task.completed) {
                const taskItem = document.createElement("div")
                taskItem.className = "text-gray-800 flex justify-around gap-4 items-center p-3 border-b last:border-0  border-gray-300";
                taskItem.innerHTML = `
                    <h4 class="w-1/6 font-semibold break-words">${task.title}</h4>
                <p class="w-1/6 break-words">${task.description}</p>
                <span class="w-1/6">${task.date}</span>
                <span class="w-1/6 capitalize">${task.priority}</span>
                <span class="w-1/6 capitalize">${task.category}</span>
            `;
                taskHistory.appendChild(taskItem)
            }
        })
    } catch (e) {
        console.log("error while display history:", e)
    }
}

window.onload = () => {

    // loadTasksFromLocalStorage();

    // load tak using callBack Function

    // This is the callback function, defined separately
    // const handleTasksResult=(err, tasks) =>{
    //     if (err) {
    //         console.log("Something went wrong:", err);
    //     } else {

    //         console.log("Tasks loaded using callBack Function:", tasks);
    //     }
    // }

    // Passing it as an argument

    // loadTasksWithCallback(handleTasksResult);


    // load task using promices rsolve/reject

    // loadTasksWithPromise()
    // .then(tasks => console.log("Tasks loaded using promices:", tasks))
    // .catch(err => console.error("Error loading tasks:", err));

    // Self-Invoking Functions
    // load data using async/await

    (async () => {
        try {
            const tasks = await loadTasksAsync();
            console.log("Tasks loaded by async/await:", tasks);
        } catch (err) {
            console.error("Error loading tasks:", err);
        }
    })();

    taskManager.updateTaskCountDisplay();

    // fake count of task using call
    // taskManager.updateTaskCountDisplay.call(fakeTaskManager)

    displayHistory();
    displayTaskData();
    dueTodayTask();

};
