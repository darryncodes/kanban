const task = document.querySelectorAll(".task");
const lane = document.querySelectorAll(".lane");

const form = document.getElementById("form");
const input = document.getElementById("input");
const todo = document.getElementById("todo");

const taskBtn = document.querySelectorAll(".task-btn");
const addTodoBtn = document.getElementById("todo-btn");
const overlay = document.getElementById("overlay");

let actions;

// FUNCTION TO TURN STYLING ON AND OFF WHEN TASK IS BEING DRAGGED
const handleStyle = (task) => {
    task.addEventListener("dragstart", () => {
        task.classList.add("dragging");
    });
    task.addEventListener("dragend", () => {
        task.classList.remove("dragging");
    });
};
task.forEach(handleStyle);

// FUNCTION TO ADD TASK TO LANE AND SHUFFLE TASK
const handleDragOver = (column) => {
    column.addEventListener("dragover", (e) => {
        e.preventDefault();

        const bottomTask = insertAboveTask(column, e.clientY);
        const currentTask = document.querySelector(".dragging");

        if (!bottomTask) {
            column.appendChild(currentTask);
        } else {
            column.insertBefore(currentTask, bottomTask);
        }
    });
};
lane.forEach(handleDragOver);

// PLACEMENT LOGIC
const insertAboveTask = (column, mouseY) => {
    const els = column.querySelectorAll(".task:not(.dragging)");

    let closestTask = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    els.forEach((task) => {
        const { top } = task.getBoundingClientRect();
        const offset = mouseY - top;

        if (offset < 0 && offset > closestOffset) {
            closestOffset = offset;
            closestTask = task;
        }
    });

    return closestTask;
};

// CREATE NEW TODO
const createTask = (e) => {
    e.preventDefault();
    const value = input.value;

    if (!value) return;

    renderTask(value);

    // SAVE TO LOCAL STORAGE
    saveLocalTasks(value);

    // RESET INPUT
    input.value = "";
};
form.addEventListener("submit", createTask);

// ABSTRACTED RENDER TODO LOGIC
const renderTask = (value) => {
    const color = hexGenerator();
    const newTask = document.createElement("div");
    newTask.classList.add("task");
    newTask.setAttribute("draggable", "true");
    newTask.style.borderTop = `3px solid ${color}`;

    const content = document.createElement("p");
    content.innerText = value;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("task-btn");
    deleteBtn.innerText = "X";

    newTask.appendChild(content);
    newTask.appendChild(deleteBtn);

    handleStyle(newTask);

    todo.appendChild(newTask);
};

// DELETE TODO
const deleteFunction = (e) => {
    if (e.target.classList.value === "task-btn") {
        const task = e.target.parentElement;
        removeLocalTasks(task);
        task.remove();
    }
};
document.addEventListener("click", deleteFunction);

// ABSTRACTED CHECK LOCAL STORAGE FUNCTION
const checkLocalStorageArray = () => {
    if (localStorage.getItem("actions") === null) {
        actions = [];
    } else {
        actions = JSON.parse(localStorage.getItem("actions"));
    }
};

const saveLocalTasks = (action) => {
    checkLocalStorageArray();

    actions.push(action);
    localStorage.setItem("actions", JSON.stringify(actions));
};

const getLocalTasks = () => {
    checkLocalStorageArray();

    actions.forEach((task) => {
        renderTask(task);
    });
};
window.onload = getLocalTasks;

const removeLocalTasks = (task) => {
    checkLocalStorageArray();

    const taskIndex = task.children[0].innerText;
    actions.splice(actions.indexOf(taskIndex), 1);
    localStorage.setItem("actions", JSON.stringify(actions));
};

// RANDOM HEX COLOUR GENERATOR FOR TASK BORDER
const hex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];

function getRandomNumber() {
    return Math.floor(Math.random() * hex.length);
}

function hexGenerator() {
    let hexColor = "#";

    for (let i = 0; i < 6; i++) {
        hexColor += hex[getRandomNumber()];
    }

    return hexColor;
}

// MENU FUNCTIONALITY
addTodoBtn.addEventListener("click", () => {
    addTodoBtn.classList.toggle("open");
    addTodoBtn.classList.toggle("todo-btn-bg");
    form.classList.toggle("show");
    overlay.classList.toggle("overlay");
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        form.classList.remove("show");
        overlay.classList.remove("overlay");
    }
});
