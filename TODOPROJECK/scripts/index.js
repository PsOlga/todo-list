const currentDate = document.querySelector(".currentDate");
const searchBar = document.querySelector(".searchBar");
const searchBtn = document.querySelector(".searchBtn");
const generationForm = document.querySelector(".generationForm");
const description = document.querySelector(".description");
const date = document.querySelector(".date");
const addBtn = document.querySelector(".addBtn");
const clearBtn = document.querySelector(".clearBtn");
const listOfEntry = document.querySelector(".listOfEntry");
const filterButtons = document.querySelectorAll(".filterBtn");
const editBtn = document.querySelector(".editBtn");

const container = document.querySelector(".container");
const editContainer = document.querySelector(".editContainer");

const editListOfEntry = document.querySelector(".editListOfEntryChenges");
const saveBtn = document.querySelector(".saveBtn");
const cancelBtn = document.querySelector(".cancelBtn");

const deleteTaskBtns = document.querySelectorAll(".deleteTaskBtn");

function dateDisplay() {
  const today = new Date();
  const dayOfWeek = today.toLocaleDateString("en-EN", { weekday: "long" });
  const dayOfMonth = today.toLocaleDateString("en-EN", { day: "numeric" });
  const month = today.toLocaleDateString("en-EN", { month: "long" });
  const formattedDate = `${dayOfWeek}<br>${dayOfMonth} ${month}`;
  currentDate.innerHTML = formattedDate;
}

function createTask(task) {
  const liContainer = document.createElement("li");
  const infoDiv = document.createElement("div");
  infoDiv.classList.add("task-info");

  const taskData = document.createElement("p");
  taskData.textContent = task.date;

  const taskTitle = document.createElement("h3");
  taskTitle.textContent = task.description;

  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.classList.add("checkbox");
  checkbox.style.width = "20px";
  checkbox.style.height = "20px";
  const deleteTaskBtn = document.createElement("button");
  deleteTaskBtn.innerHTML = "delete";
  deleteTaskBtn.setAttribute("class", "deleteTaskBtn");

  if (task.completed) {
    taskTitle.style.textDecoration = "line-through";
    taskTitle.style.opacity = 0.5;
    taskData.style.opacity = 0.5;
    checkbox.checked = true;
  }

  infoDiv.append(taskData, taskTitle);
  liContainer.append(checkbox, infoDiv);
  liContainer.classList.add("listOfEntrychilds");
  liContainer.style.borderRadius = "28px";

  if (task.completed) {
    liContainer.classList.add("completedTask");
  } else {
    liContainer.classList.add("activeTask");
  }

  listOfEntry.append(liContainer);

  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;

    if (checkbox.checked) {
      taskTitle.style.textDecoration = "line-through";
      taskTitle.style.opacity = 0.5;

      taskData.style.opacity = 0.5;
      liContainer.classList.remove("activeTask");
      liContainer.classList.add("completedTask");
    } else {
      taskTitle.style.textDecoration = "none";
      taskTitle.style.opacity = 1;
      taskData.style.opacity = 1;
      liContainer.classList.remove("completedTask");
      liContainer.classList.add("activeTask");
    }

    saveTasks();
  });
}
function loadEditTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  editListOfEntry.innerHTML = "";
  tasks.forEach((task) => {
    const liContainer = document.createElement("li");
    const descriptionInput = document.createElement("input");
    descriptionInput.type = "text";
    descriptionInput.value = task.description;
    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.value = task.date;
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    const deleteTaskBtn = document.createElement("button");
    deleteTaskBtn.innerHTML = "delete";
    deleteTaskBtn.setAttribute("class", "deleteTaskBtn");

    deleteTaskBtn.addEventListener("click", () => {
      const item = deleteTaskBtn.closest("li");
      item.remove();
      saveEditTasks();
    });

    liContainer.append(descriptionInput, dateInput, checkbox, deleteTaskBtn);
    editListOfEntry.appendChild(liContainer);
  });
}
let taskIdCounter = 1;

function generateUniqueId() {
  return String(taskIdCounter++);
}

function addTask(description, date) {
  const task = {
    id: generateUniqueId(),
    description: description,
    date: date,
    completed: false,
  };
  createTask(task);
  saveTasks();
}

function searchTasks(tasksList, value) {
  const filteredTasks = tasksList.filter((task) =>
    task.description.toLowerCase().includes(value.toLowerCase())
  );
  listOfEntry.innerHTML = "";

  if (filteredTasks.length > 0) {
    filteredTasks.forEach(createTask);
  } else {
    const noResults = document.createElement("li");
    noResults.textContent = "no relevant tasks";
    listOfEntry.appendChild(noResults);
  }
}

function filterTasks(filter) {
  const tasksList = JSON.parse(localStorage.getItem("tasks")) || [];

  listOfEntry.innerHTML = "";

  tasksList.forEach((task) => {
    if (
      filter === "all" ||
      (filter === "active" && !task.completed) ||
      (filter === "completed" && task.completed)
    ) {
      createTask(task);
    }
  });

  const listItems = document.querySelectorAll(".listOfEntry > li");
  listItems.forEach((item) => {
    item.classList.add("listOfEntrychilds");
    item.style.borderRadius = "28px";
  });
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    createTask(task);
  });
}

function saveTasks() {
  const tasks = Array.from(listOfEntry.children).map((li) => {
    const checkbox = li.querySelector(".checkbox");
    const taskTitle = li.querySelector("h3").textContent;
    const taskData = li.querySelector("p").textContent;
    const completed = li.classList.contains("completedTask");
    return {
      id: generateUniqueId(),
      description: taskTitle,
      date: taskData,
      completed: completed,
    };
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveEditTasks() {
  const tasks = Array.from(editListOfEntry.children).map((li) => {
    const descriptionInput = li.querySelector("input[type='text']");
    const dateInput = li.querySelector("input[type='date']");
    const checkbox = li.querySelector("input[type='checkbox']");
    return {
      id: generateUniqueId(),
      description: descriptionInput.value,
      date: dateInput.value,
      completed: checkbox.checked,
    };
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

document.addEventListener("DOMContentLoaded", () => {
  dateDisplay();
  loadTasks();

  generationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (description.value === "" || date.value === "") {
      alert("Fill in all fields");
    } else {
      addTask(description.value, date.value);
      description.value = "";
      date.value = "";
    }
  });

  date.type = "text";

  date.addEventListener("focus", () => {
    date.type = "date";
    date.click();
  });

  date.addEventListener("blur", () => {
    setTimeout(() => {
      date.type = "text";
    }, 100);
  });

  searchBar.addEventListener("input", (event) => {
    const userInputValue = event.target.value;
    const tasksList = JSON.parse(localStorage.getItem("tasks")) || [];
    searchTasks(tasksList, userInputValue);
  });

  searchBtn.addEventListener("click", () => {
    const userInputValue = searchBar.value;
    const tasksList = JSON.parse(localStorage.getItem("tasks")) || [];
    searchTasks(tasksList, userInputValue);
    searchBar.value = "";
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterTasks(filter);
    });
  });

  editBtn.addEventListener("click", () => {
    container.style.display = "none";
    editContainer.style.display = "block";
    loadEditTasks();
    // location.reload() // перезагружаемся
  });

  cancelBtn.addEventListener("click", () => {
    container.style.display = "block";
    editContainer.style.display = "none";
    location.reload(); // перезагружаемся
  });

  saveBtn.addEventListener("click", () => {
    saveEditTasks();
    container.style.display = "block";
    editContainer.style.display = "none";
    location.reload(); 
  });
});
