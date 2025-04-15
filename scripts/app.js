


let tasks = [];
const reminders = [];
let currentEditTaskId = null;

// setting and getting Data from Local Sto 
const saveTasksToLocalStorage = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

const loadTasksFromLocalStorage = () => {
    const savedTasks = localStorage.getItem("tasks");
    try {
        const parsedTasks = JSON.parse(savedTasks);
        if (Array.isArray(parsedTasks)) {
            tasks = parsedTasks;
        } else {
            tasks = []; 
        }
    } catch (e) {
        console.error("Failed to parse tasks from localStorage:", e);
        tasks = []; 
    }
}


// show and hide popup to add new task

const showAddTaskForm = () => {
    document.getElementById("add-task-form").style.display = "block"
}

const closeAddTaskWindow = () => {
    document.getElementById("add-task-form").style.display = "none"
}

// Get totalcount to Task's
const totalTaskCount = () => {
    document.getElementById("total-task-count").innerText = `Total Tasks: ${tasks.length ? tasks.length : "No Tasks"}`;
}


// Reminder Task that are Due Today
function ReminderDueTask(id, title, message) {
    this.id = id;
    this.title = title;
    this.message = message;
}

const dueTodayTask = () => {
    let currentTime = Date.now();

    tasks.forEach((task) => {
        const taskTime = new Date(task.date).getTime();
        if (!task.completed && taskTime - currentTime <= 20000000) {
            const message = `Reminder: Task "${task.title}" is due soon!`;
            const reminder = new ReminderDueTask(task.id, task.title, message);
            reminders.push(reminder);
            console.log("reminders:", reminders)
        }
    })
    displayDuetaskToday();
}

const displayDuetaskToday = () => {
    console.log("enter displayDuetaskToday fun ")

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
    console.log("tasks befre sort:", tasks)
    tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    console.log("tasks after sort:", tasks)
    saveTasksToLocalStorage();
    window.location.reload();
}

const sortByPriority = () => {
    console.log("tasks befre sort:", tasks)
    const priorityOrder = {
        high: 1,
        medium: 2,
        low: 3
    }
    tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    console.log("tasks after sort:", tasks)
    saveTasksToLocalStorage();
    window.location.reload();
}

const sortByCategoryFun = () => {
    const groupTask = Map.groupBy(tasks, task => task.category)
    console.log("group by catrgory tasks:", groupTask)
    return groupTask;
}

// Updata Task
const updateTask = (id) => {
    const task = tasks.find(t => t.id === id);
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
        tasks = tasks.filter(task => task.id !== id);
        saveTasksToLocalStorage();
        window.location.reload();
    }
    catch (e) {
        console.log("Internal Server Error:", e)
    }
}

// Mark Task As Completed
const taskCompleted = (id) => {
    try {
        const task = tasks.find(task => task.id == id)
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
            const task = tasks.find(t => t.id === currentEditTaskId);
            if (task) {
                task.title = taskTitle;
                task.description = taskDescription;
                task.date = taskDate;
                task.priority = taskPriority;
                task.category = taskCategory;
            }
        } else {
            // ADD mode
            const taskTitles = new Set(tasks.map(task => task.title.toLowerCase()));
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
            const taskDetail={
                priority: taskPriority,
                category: taskCategory,
                completed: false
            }

            // Copies properties form obj2 to obj1
            Object.assign(task,taskDetail)
            
            // make id property only readable
            Object.defineProperty(task,"id",{
                writable:false,     // cannot change value
                enumerable: true,    // shows up in loops
                configurable: false  // can't delete or modify descriptor
            })
            // Prevent Extension
            Object.preventExtensions(task)

            tasks.push(task);
        }
        saveTasksToLocalStorage();
        taskAddedPopup.style.display = "block";
        setTimeout(() => {
            closeAddTaskWindow();
            taskAddedPopup.style.display = "none";
            document.getElementById("taskForm").reset();
            currentEditTaskId = null;
            window.location.reload();
        }, 900);
    } catch (e) {
        console.log("Internal Server Error:", e);
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
        tasks.forEach(task => {
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
const displayHistory = () => {
    const taskHistory = document.getElementById("task-history");
    try {
        tasks.forEach((task => {
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
        }))
    } catch (e) {
        console.log("error while display history:", e)
    }
}

// call function every time on load page
window.onload = () => {
    loadTasksFromLocalStorage();
    totalTaskCount();
    displayHistory();
    displayTaskData();
    dueTodayTask();

};
