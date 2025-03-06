document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelectorAll(".add-task-btn");
  const dialogueBox = document.querySelector("#dialogue-box");
  const dialogueBoxCloseBtn = document.querySelector(".dialogueBoxCloseBtn");
  const taskTitleInput = document.querySelector("#taskTitleInput");
  const taskDescription = document.querySelector("#taskDescription");
  const getTaskTimings = document.querySelector("#taskTimings");
  const dialogueBoxAddTaskBtn = document.querySelector(
    "#dialogueBoxAddTaskBtn"
  );
  const dialogueBoxCancelTaskBtn = document.querySelector(
    "#dialogueBoxCancelTaskBtn"
  );
  const taskContainerToDo = document.querySelector(".task-container");
  const boxesTask = document.querySelectorAll(".box");

  let arrTask = JSON.parse(localStorage.getItem("tasks")) || [];

  // Render existing tasks
  renderTask();

  // Function to render tasks
  function renderTask() {
    taskContainerToDo.innerHTML = ""; 
    arrTask.forEach((task) => {
      const tasks = createElem(task);
      taskContainerToDo.appendChild(tasks);
    });
  }

  // Function to add tasks to localStorage
  function addStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Function to clear input fields
  function clearInputs() {
    taskTitleInput.value = "";
    taskDescription.value = "";
    getTaskTimings.value = "";
  }

  // Function to create a task element
  function createElem(newTask) {
    const divt = document.createElement("div");
    divt.setAttribute("draggable", true);
    divt.addEventListener("dragstart", () => {
      divt.classList.add("flying");
    });
    divt.addEventListener("dragend", () => {
      divt.classList.remove("flying");
    });

    divt.innerHTML = `
      <div 
        id="${newTask.id}"
        class="task-container w-full p-4 mt-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-300 cursor-pointer"
      >  
        <div class="flex items-center justify-between">
          <div class="flex flex-col">
            <p class="text-white font-medium text-[21px]">${newTask.title}</p>
            <p class="text-white text-sm font-medium">${newTask.description}</p>
          </div>
          <div class="flex gap-2">
            <button id="${newTask.id}" class="edit-btn text-gray-300 hover:text-white transition-colors duration-200">
              ✏️
            </button>
            <button id="${newTask.id}" class="delete-btn text-gray-300 hover:text-white transition-colors duration-200">
              🗑️
            </button>
          </div>
        </div>
        <div class="mt-2 flex items-center gap-2 text-sm text-white/80">
          <span>📅 Due: ${newTask.dueDate}</span>
        </div>
      </div>
    `;

    // Add delete functionality
    const deleteBtn = divt.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", (e) => {
      e.preventDefault();
      arrTask = arrTask.filter((task) => task.id !== newTask.id);
      addStorage(arrTask);
      divt.remove();
    });

    // Add edit functionality
    const editBtn = divt.querySelector(".edit-btn");
    editBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openEditDialogue(newTask);
    });

    return divt;
  }

  // Function to open edit dialogue box
  function openEditDialogue(task) {
    taskTitleInput.value = task.title;
    taskDescription.value = task.description;
    getTaskTimings.value = task.dueDate;
    dialogueBox.style.display = "flex";

    // Change the add task button to update task button
    dialogueBoxAddTaskBtn.textContent = "Update Task";
    dialogueBoxAddTaskBtn.removeEventListener("click", addTaskHandler);
    dialogueBoxAddTaskBtn.addEventListener("click", () =>
      updateTaskHandler(task)
    );
  }

  // Function to handle task update
  function updateTaskHandler(task) {
    if (!taskTitleInput.value.trim() || !taskDescription.value.trim()) {
      return; // Prevent updating with empty values
    }

    task.title = taskTitleInput.value;
    task.description = taskDescription.value;
    task.dueDate = getTaskTimings.value;

    addStorage(arrTask);
    clearInputs();
    renderTask();
    dialogueBox.style.display = "none";

    // Reset the add task button
    dialogueBoxAddTaskBtn.textContent = "Add Task";
    dialogueBoxAddTaskBtn.removeEventListener("click", updateTaskHandler);
    dialogueBoxAddTaskBtn.addEventListener("click", addTaskHandler);
  }

 
  function addTaskHandler() {
    if (!taskTitleInput.value.trim() || !taskDescription.value.trim()) {
      return; 
    }

    const newTask = {
      id: Date.now(),
      title: taskTitleInput.value,
      description: taskDescription.value,
      dueDate: getTaskTimings.value,
    };

    arrTask.push(newTask);
    addStorage(arrTask);
    clearInputs();
    const newTasks = createElem(newTask);
    taskContainerToDo.appendChild(newTasks);
    dialogueBox.style.display = "none";
  }

  addBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      dialogueBox.style.display = "flex";
    });
  });

  // Close dialogue box
  dialogueBoxCloseBtn.addEventListener("click", (e) => {
    dialogueBox.style.display = "none";
    clearInputs();
  });

  // Add new task
  dialogueBoxAddTaskBtn.addEventListener("click", addTaskHandler);

  // Cancel task addition
  dialogueBoxCancelTaskBtn.addEventListener("click", () => {
    clearInputs();
    dialogueBox.style.display = "none";
  });

  // Drag-and-drop functionality
  boxesTask.forEach((box) => {
    const taskContainer = box.querySelector(".task-container");
    taskContainer.addEventListener("dragover", (e) => {
      e.preventDefault();
      const flyingElement = document.querySelector(".flying");
      if (flyingElement && e.target !== box.querySelector(".add-task-btn")) {
        taskContainer.appendChild(flyingElement);
      }
    });
  });
});
