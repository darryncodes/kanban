const task = document.querySelectorAll(".task");
const lane = document.querySelectorAll(".lane");

const form = document.getElementById("form");
const input = document.getElementById("input");
const todo = document.getElementById("todo");

const taskBtn = document.querySelectorAll(".task-btn");

let actions = [];

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

// ADD NEW TODO
const createTask = (e) => {
    e.preventDefault();
    const value = input.value;

    if (!value) return;

    const newTask = document.createElement("div");
    newTask.classList.add("task");
    newTask.setAttribute("draggable", "true");

    const content = document.createElement("p");
    content.innerText = value;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("task-btn");
    deleteBtn.innerText = "X";

    newTask.appendChild(content);
    newTask.appendChild(deleteBtn);

    handleStyle(newTask);

    todo.appendChild(newTask);

    // CREATE OBJECT FOR LOCAL STORAGE
    const action = {
        id: Date.now(),
        content: value,
    };
    actions.push(action);
    addToLocalStorage(actions);

    // RESET INPUT
    input.value = "";
};

form.addEventListener("submit", createTask);

// DELETE TO DO

document.addEventListener("click", function (e) {
    if (e.target.classList.value === "task-btn") {
        e.target.parentElement.remove();
    }
});

// LOCAL STORAGE

const addToLocalStorage = (actions) => {
    localStorage.setItem("actions", JSON.stringify(actions));
};

const getFromLocalStorage = () => {
    const data = localStorage.getItem("actions");

    if (data) {
        actions = JSON.parse(data);
    }
};
