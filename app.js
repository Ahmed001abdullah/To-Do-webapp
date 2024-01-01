let tasks = [];
let editedTaskId = null;

function addTask() {
    const taskInput = document.getElementById('task-input');
    const dueDateInput = document.getElementById('due-date');
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;

    if (taskText !== '' && dueDate !== '') {
        const newTask = {
            id: Date.now(),
            text: taskText,
            dueDate: dueDate,
            completed: false
        };

        tasks.push(newTask);
        updateTaskList();
        taskInput.value = '';
        dueDateInput.value = '';
    }
}

function toggleTaskStatus(id) {
    tasks = tasks.map(task => (task.id === id ? { ...task, completed: !task.completed } : task));
    updateTaskList();
}

function editTask(id) {
    // Exit edit mode if already editing another task
    if (editedTaskId !== null) {
        cancelEdit();
    }

    // Enter edit mode
    editedTaskId = id;

    updateTaskList();
}

function saveEditedTask() {
    const editedTaskInput = document.getElementById('edit-task-input');
    const editedTaskText = editedTaskInput.value.trim();

    if (editedTaskText !== '') {
        tasks = tasks.map(task => (task.id === editedTaskId ? { ...task, text: editedTaskText } : task));

        // Exit edit mode
        editedTaskId = null;

        updateTaskList();
    } else {
        alert("Task cannot be empty. Please enter a valid task.");
    }
}

function cancelEdit() {
    // Exit edit mode
    editedTaskId = null;

    updateTaskList();
}

function removeTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    updateTaskList();
}

function updateTaskList() {
    const taskList = document.getElementById('task-list');
    const showAllTasksRadio = document.getElementById('show-all-tasks');
    const showCompletedTasksRadio = document.getElementById('show-completed-tasks');
    const showPendingTasksRadio = document.getElementById('show-pending-tasks');
    const currentDate = new Date();

    // Filter tasks based on the selected filter
    let filteredTasks = [];
    if (showAllTasksRadio.checked) {
        filteredTasks = tasks;
    } else if (showCompletedTasksRadio.checked) {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (showPendingTasksRadio.checked) {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    taskList.innerHTML = '';

    filteredTasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div class="task-info ${task.completed ? 'completed' : 'pending'}">
                ${editedTaskId === task.id ? `<input type="text" id="edit-task-input" value="${task.text}">` : `<span>${task.text}</span>`}
                <span class="due-date">${task.dueDate}</span>
                <div class="task-buttons">
                    <button onclick="toggleTaskStatus(${task.id})"><i class="fas ${task.completed ? 'fa-check-circle' : 'fa-circle'}"></i></button>
                    <button onclick="editTask(${task.id})"><i class="fas fa-edit"></i></button>
                    <button onclick="removeTask(${task.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
        taskList.appendChild(listItem);
    });

    // If in edit mode, add save and cancel buttons with icons
    if (editedTaskId !== null) {
        const editItem = document.createElement('li');
        editItem.innerHTML = `
            <div class="task-info">
                <button onclick="saveEditedTask()"><i class="fas fa-save"></i></button>
                <button onclick="cancelEdit()"><i class="fas fa-times"></i></button>
            </div>
        `;
        taskList.appendChild(editItem);
    }
}

// Initial task list update
updateTaskList();
