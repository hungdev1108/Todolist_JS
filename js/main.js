$(function () {
  $(".toggle-btn").click(function () {
    $(".filter-btn").toggleClass("open");
  });

  $(".filter-btn a").click(function () {
    $(".filter-btn").removeClass("open");
  });
});

var taskList = [];

// addTask
function addTask() {
  if (!validation()) {
    return;
  }

  // var id = Math.floor(Math.random() * 1000);
  var id = Date.now();
  var taskName = document.getElementById("newTask");
  var status = "todo";

  // Tạo đối tượng Task mới
  var task = new Task(id, taskName.value, status);

  // Thêm task vảo mảng
  taskList.push(task);

  // In ra danh sách task
  renderTaskList();

  // Lưu danh sách vào localStorage
  saveLocalStorage();

  taskName.value = "";
}

// renderTask
function renderTaskList(data) {
  var notiInput = document.getElementById("notiInput");
  notiInput.style.display = "none";

  if (!data) {
    data = taskList;
  }

  var resultTodo = "";
  var resultTodoCompleted = "";

  for (var i = 0; i < data.length; i++) {
    var currentTaskList = data[i];
    if (data[i].status == "todo") {
      resultTodo += `
    <li>
        ${currentTaskList.taskName}
        <div class="buttons">
            <button class="edit" onClick="getTask(${currentTaskList.id});">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="remove" onClick="deleteTask(${currentTaskList.id});">
                <i class="fa fa-trash-alt"></i>
            </button>
            <button class="complete" onClick="changeStatus(${currentTaskList.id});">
                <i class="fa fa-circle-check"></i>
            </button>
        </div>
  </li> 
    `;
    }
    document.getElementById("todo").innerHTML = resultTodo;

    if (data[i].status == "completed") {
      resultTodoCompleted += `
      <li>
         <span> 
            ${currentTaskList.taskName}
         </span>
          <div class="buttons">
              <button class="remove" onClick="deleteTask(${currentTaskList.id});">
                  <i class="fa fa-trash-alt"></i>
              </button>
              <button class="complete" onClick="changeStatus(${currentTaskList.id});">
                  <span>
                  <i class="fa fa-circle-check"></i>
                  </span>
              </button>
          </div>
    </li>
      `;
    }
    document.getElementById("completed").innerHTML = resultTodoCompleted;
  }
}

// deleteTask
function deleteTask(id) {
  var index = findIndex(id);

  if (index === -1) return alert("Id không tồn tại");
  taskList.splice(index, 1);
  alert("Xóa thành công");
  renderTaskList();
  saveLocalStorage();
}

// get & update
var updateId = 0;
function getTask(id) {
  var index = findIndex(id);

  if (index === -1) return alert("Id không tồn tại");

  updateId = id;

  var foundTask = taskList[index];

  document.getElementById("newTask").value = foundTask.taskName;

  document.getElementById("addItem").style.display = "none";
  document.getElementById("updateTask").style.display = "block";
}

function updateTask() {
  var taskName = document.getElementById("newTask").value;
  var index = findIndex(updateId);

  if (index === -1) return alert("Id không tồn tại");

  var foundTask = taskList[index];

  if (taskList[index].taskName == document.getElementById("newTask").value) {
    var notiInput = document.getElementById("notiInput");
    notiInput.style.display = "block";
    notiInput.innerHTML = "Trùng tên task rồi bạn ơi!!!";
    return;
  }

  foundTask.taskName = taskName;

  renderTaskList();
  saveLocalStorage();

  document.getElementById("addItem").style.display = "block";
  document.getElementById("updateTask").style.display = "none";

  document.getElementById("newTask").value = "";
}

// change StatusTask
function changeStatus(id) {
  var index = findIndex(id);
  if (index === -1) return alert("Id không tồn tại");

  if (taskList[index].status === "todo") taskList[index].status = "completed";
  else taskList[index].status = "todo";

  renderTaskList();
  saveLocalStorage();
}

// findIndex = id
function findIndex(id) {
  for (var i = 0; i < taskList.length; i++) {
    if (taskList[i].id === id) {
      return i;
    }
  }
  return -1;
}

// getLocalStorage
function getLocalStorage() {
  var taskListJSON = localStorage.getItem("listTask");
  if (!taskListJSON) return;

  var taskListLocal = JSON.parse(taskListJSON);

  // Gán dữ liệu từ mảng cũ qua mảng mới
  for (var i = 0; i < taskListLocal.length; i++) {
    var currentTaskList = taskListLocal[i];
    taskList.push(
      new Task(currentTaskList.id, currentTaskList.taskName, currentTaskList.status)
    );
  }

  renderTaskList();
}

// saveLocalStorage
function saveLocalStorage() {
  var taskListJSON = JSON.stringify(taskList);
  localStorage.setItem("listTask", taskListJSON);
}

getLocalStorage();

// Validation
function validation() {
  var taskName = document.getElementById("newTask");
  var notiInput = document.getElementById("notiInput");

  if (taskName.value.trim() == "") {
    notiInput.style.display = "block";
    notiInput.innerHTML = "Nhập vào tên task đi bạn :) !";
    return false;
  }
  notiInput.style.display = "none";
  return true;
}
