const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const taskPriority = document.getElementById("taskPriority");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const filters = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function showDate(){
  const today = new Date();

  document.getElementById("dateBox").innerText =
    today.toLocaleDateString("en-US",{
      weekday:"long",
      year:"numeric",
      month:"long",
      day:"numeric"
    });
}

showDate();

function saveTasks(){
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateStats(){

  totalTasks.innerText = tasks.length;

  const completed = tasks.filter(task => task.completed).length;

  completedTasks.innerText = completed;

  pendingTasks.innerText = tasks.length - completed;
}

function renderTasks(){

  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if(currentFilter === "completed"){
    filteredTasks = tasks.filter(task => task.completed);
  }

  if(currentFilter === "pending"){
    filteredTasks = tasks.filter(task => !task.completed);
  }

  if(filteredTasks.length === 0){

    taskList.innerHTML = `
      <div class="empty">
        <h3>No Tasks Found</h3>
        <p>Add some tasks to stay productive.</p>
      </div>
    `;

    updateStats();
    return;
  }

  filteredTasks.forEach(task => {

    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");

    if(task.completed){
      taskCard.classList.add("completed");
    }

    taskCard.innerHTML = `
      <div class="left">

        <input type="checkbox"
        ${task.completed ? "checked" : ""}
        onchange="toggleTask(${task.id})">

        <div class="content">

          <h3>${task.text}</h3>

          <p>
            📅 ${task.date || "No Date"}
            &nbsp;&nbsp;
            ⏰ ${task.time || "No Time"}
          </p>

          <span class="priority ${task.priority.toLowerCase()}">
            ${task.priority} Priority
          </span>

        </div>

      </div>

      <div class="actions">

        <button class="btn edit"
        onclick="editTask(${task.id})">
          Edit
        </button>

        <button class="btn delete"
        onclick="deleteTask(${task.id})">
          Delete
        </button>

      </div>
    `;

    taskList.appendChild(taskCard);
  });

  updateStats();
}

function addTask(){

  const text = taskInput.value.trim();

  if(!text){
    alert("Please enter a task");
    return;
  }

  const task = {
    id: Date.now(),
    text: text,
    date: taskDate.value,
    time: taskTime.value,
    priority: taskPriority.value,
    completed: false
  };

  tasks.unshift(task);

  saveTasks();
  renderTasks();

  taskInput.value = "";
  taskDate.value = "";
  taskTime.value = "";
  taskPriority.value = "Low";
}

function toggleTask(id){

  tasks = tasks.map(task => {

    if(task.id === id){
      task.completed = !task.completed;
    }

    return task;
  });

  saveTasks();
  renderTasks();
}

function deleteTask(id){

  tasks = tasks.filter(task => task.id !== id);

  saveTasks();
  renderTasks();
}

function editTask(id){

  const task = tasks.find(task => task.id === id);

  const updated = prompt("Edit task", task.text);

  if(updated === null) return;

  task.text = updated.trim() || task.text;

  saveTasks();
  renderTasks();
}

addBtn.addEventListener("click", addTask);

filters.forEach(button => {

  button.addEventListener("click", () => {

    filters.forEach(btn =>
      btn.classList.remove("active")
    );

    button.classList.add("active");

    currentFilter = button.dataset.filter;

    renderTasks();
  });
});

renderTasks();