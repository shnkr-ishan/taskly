let addWrapper = document.getElementById("addWrapper");
let addText = document.getElementById("addText");
let menu = document.getElementById("menu");
let container = document.querySelector(".container");
let sidebar = document.getElementById("sidebar");
let addTaskBtn = document.getElementById("addWrapper");
let modal = document.getElementById("modal");
let modalClose = document.getElementById("modalClose");
let deadline = document.getElementById("deadline");
let addCategory = document.getElementById("addCategory");
let ctgryUL = document.getElementById("ctgryUL");
let addNew = document.getElementById("addNew");
let currentCategory = "Inbox";
let categoryArray = ["Inbox"];
let currentFilteredHash = "";
let hashArray = [];
let tasks = [];
let todoTitle = document.getElementById("data");
let todoDeadline = document.getElementById("deadline");
let todoTag = document.getElementById("tag");
let modalCategory = document.getElementById("modalCategory");
let setTaskToStorageBtn = document.getElementById("addTaskBtn");
let gridArea = document.getElementById("gridArea");
let delCat = document.getElementById("delCat");
let hashUL = document.getElementById("hashUL");
let completeGridArea = document.getElementById("completeGridArea");
let refreshBtn = document.getElementById("refresh");

const init = () => {
  Notification.permission === "granted"
    ? console.log("Notifications are enabled.")
    : askNotificationPermission();
  setDate();
  checkIfOverdue();
  firstTime();
  setInterval(routineCheck, 60000);
};

if (document.readyState !== "loading") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}

const askNotificationPermission = async () => {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notifications.");
    return;
  }
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    console.log("Notifications are enabled.");
  } else {
    console.log(
      "Permission denied. Enable notifications for a better experience.",
    );
  }
};

const getCurrentDate = () => {
  let now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  let formattedNow = now.toISOString().slice(0, 16);
  return formattedNow;
};

const setDate = () => {
  let currentDate = getCurrentDate();
  document.getElementById("deadline").value = currentDate;
};

const randNum = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const firstTime = () => {
  let items = localStorage.getItem("categoryArray");
  if (!items) {
    localStorage.setItem("categoryArray", categoryArray);
    localStorage.setItem("currentCategory", currentCategory);
    localStorage.setItem("tasks", tasks);
    localStorage.setItem("hashArray", hashArray);
  }
  populateCategory();
  populateTasks();
  populateHash();
};

addWrapper.onmouseover = () => {
  addText.classList.add("animate__fadeInUp");
};

addWrapper.onmouseout = () => {
  addText.classList.remove("animate__fadeInUp");
};

const changeBlur = () => {
  const shouldBlur =
    sidebar.classList.contains("sidebar_open") ||
    modal.classList.contains("show_modal");

  container.classList.toggle("blur", shouldBlur);
};

const openSidebar = () => {
  sidebar.classList.add("sidebar_open");
  sidebar.classList.remove("sidebar_close");
  changeBlur();
};

const closeSidebar = () => {
  sidebar.classList.add("sidebar_close");
  sidebar.classList.remove("sidebar_open");
  changeBlur();
};

const showModal = () => {
  modal.classList.add("show_modal");
  modal.classList.add("animate__backInDown");
  modal.classList.remove("hide_modal");
  changeBlur();
};

const hideModal = () => {
  modal.classList.remove("show_modal");
  modal.classList.remove("animate__backInDown");
  modal.classList.add("hide_modal");
  changeBlur();
};

menu.onclick = () => {
  sidebar.classList.contains("sidebar_open") ? closeSidebar() : openSidebar();
};

document.addEventListener("click", (event) => {
  if (!sidebar.contains(event.target) && !menu.contains(event.target)) {
    closeSidebar();
  }
});

addTaskBtn.onclick = () => {
  showModal();
};

modalClose.onclick = () => {
  hideModal();
};

const setModalCategory = () => {
  modalCategory.value = currentCategory;
};

const addInputField = () => {
  if (document.getElementById("newCategory")) return;
  let inp = document.createElement("input");
  inp.type = "text";
  inp.id = "newCategory";
  inp.maxLength = "20";
  inp.addEventListener("click", (e) => {
    e.stopPropagation();
  });
  addNew.appendChild(inp);
  inp.focus();
};

const setAndFetchCurrent = (e) => {
  let prev = currentCategory;
  currentCategory = e;
  setModalCategory();
  localStorage.setItem("currentCategory", currentCategory);
  document.getElementById(prev).classList.remove("active");
  document.getElementById(currentCategory).classList.add("active");
  populateTasks();
  closeSidebar();
};

const populateCategory = () => {
  let items = localStorage.getItem("categoryArray");
  let data = "";
  currentCategory = localStorage.getItem("currentCategory");
  setModalCategory();
  categoryArray = items.split(",");
  categoryArray.forEach((e, i) => {
    data += `<li ${e == currentCategory ? "class = 'active'" : ""} onclick="setAndFetchCurrent('${e}')" id="${e}"><p>${e}</p></li>`;
  });
  ctgryUL.innerHTML = data;
};

const addCategoryFunc = () => {
  let found = false;
  let newCategory = document.getElementById("newCategory");
  if (!newCategory) return;
  let value = newCategory.value.trim();
  categoryArray.forEach((e, i) => {
    if (e == value) found = true;
  });
  if (value === "" || found) {
    document.removeEventListener("click", addCategoryFunc);
    addNew.removeChild(newCategory);
    return;
  } else {
    categoryArray.push(value);
    localStorage.setItem("categoryArray", categoryArray);
    populateCategory();
    document.removeEventListener("click", addCategoryFunc);
    addNew.removeChild(newCategory);
  }
};

addCategory.onclick = (e) => {
  e.stopPropagation();
  addInputField();
  setTimeout(() => {
    document.addEventListener("click", addCategoryFunc);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        addCategoryFunc();
      }
    });
  }, 0);
};

setTaskToStorageBtn.onclick = () => {
  if (todoTitle.value == "" || todoTag.value == "") return;
  if (!todoTag.value.includes("#")) {
    alert("Missing #");
    return;
  }
  let data = {
    id: randNum(),
    title: todoTitle.value,
    deadline: todoDeadline.value,
    hashtag: todoTag.value
      .split("#")
      .filter((item) => item != "")
      .map((item) => item.trim()),
    category: currentCategory,
    completed: false,
    overdue: false,
  };
  setAllTasks();
  tasks.push(data);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  let hashtags = localStorage.getItem("hashArray").split(",");
  let tempCurrentHashArray = todoTag.value
    .split("#")
    .filter((item) => item != "")
    .map((item) => item.trim());
  if (hashtags) {
    let newArray = hashtags.concat(tempCurrentHashArray);
    let newSetFromArray = new Set(newArray.filter((item) => item != ""));
    let finalTempArray = Array.from(newSetFromArray);
    localStorage.setItem("hashArray", finalTempArray);
  }
  hideModal();
  checkIfOverdue();
  populateTasks();
  populateHash();
};

const setAllTasks = () => {
  let items = localStorage.getItem("tasks");
  if (items) tasks = JSON.parse(items);
};

const deleteTodo = (id) => {
  setAllTasks();
  let updatedArray = tasks.filter((item) => item.id != id);
  let currentArray = tasks.filter((item) => item.id == id);
  let toRemoveArray = [];
  let c = 0;
  currentArray[0].hashtag.forEach((hash, i) => {
    updatedArray.forEach((otherTags, i) => {
      if (otherTags.hashtag.includes(hash)) c++;
    });
    if (c == 0) toRemoveArray.push(hash);
    c = 0;
  });
  if (toRemoveArray == null || toRemoveArray == []) return;
  let items = localStorage.getItem("hashArray").split(",");
  toRemoveArray.forEach((e, i) => {
    items = items.filter((item) => item != e);
  });
  localStorage.setItem("hashArray", items);
  localStorage.setItem("tasks", JSON.stringify(updatedArray));
  populateTasks();
  populateHash();
};

delCat.onclick = () => {
  if (currentCategory == "Inbox") return;
  let items = localStorage.getItem("categoryArray").split(",");
  let filteredArr = items.filter((item) => item !== currentCategory);
  setAllTasks();
  let filteredTodos = tasks.filter((item) => item.category !== currentCategory);
  let currentFilteredTodos = tasks.filter(
    (item) => item.category === currentCategory,
  );
  let toRemoveArray = [];
  let c = 0;
  currentFilteredTodos.forEach((e, i) => {
    e.hashtag.forEach((hash, i) => {
      filteredTodos.forEach((otherTags, i) => {
        if (otherTags.hashtag.includes(hash)) c++;
      });
      if (c == 0) toRemoveArray.push(hash);
      c = 0;
    });
  });
  if (toRemoveArray == null || toRemoveArray == []) return;
  let hashItems = localStorage.getItem("hashArray").split(",");
  toRemoveArray.forEach((e, i) => {
    hashItems = hashItems.filter((item) => item != e);
  });
  localStorage.setItem("hashArray", hashItems);
  localStorage.setItem("tasks", JSON.stringify(filteredTodos));
  localStorage.setItem("categoryArray", filteredArr);
  localStorage.setItem("currentCategory", "Inbox");
  populateCategory();
  populateTasks();
  populateHash();
};

const notify = (id) => {
  setAllTasks();
  let currentTask = tasks.filter((item) => item.id == id);
  if (Notification.permission === "granted") {
    let title = `${currentTask[0].title}`;
    let options = {
      body: "Reminder! Complete your task before its too late.",
      icon: "icon.svg",
      tag: `${id}`,
    };
    const notification = new Notification(title, options);
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
};

const compareDateAndTime = (date, time, id) => {
  let todoDateArray = date.split("-");
  let todoTimeArray = time.split(":");
  let currentDate = getCurrentDate().split("T")[0].split("-");
  let currentTime = getCurrentDate().split("T")[1].split(":");
  if (currentDate[0] > todoDateArray[0]) {
    return true;
  } else if (currentDate[0] == todoDateArray[0]) {
    if (currentDate[1] > todoDateArray[1]) {
      return true;
    } else if (currentDate[1] == todoDateArray[1]) {
      if (currentDate[2] > todoDateArray[2]) {
        return true;
      } else if (currentDate[2] == todoDateArray[2]) {
        if (currentTime[0] > todoTimeArray[0]) {
          return true;
        } else if (currentTime[0] == todoTimeArray[0]) {
          if (currentTime[1] > todoTimeArray[1]) {
            return true;
          } else if (
            parseInt(currentTime[1]) + 5 ==
            parseInt(todoTimeArray[1])
          ) {
            notify(id);
          }
        }
      }
    }
  }
  return false;
};

const populateTasks = () => {
  completeGridArea.innerHTML = "<p class='muted'>Nothing to show.</p>";
  setAllTasks();
  if (tasks == null || tasks == [] || tasks.length == 0) {
    gridArea.innerHTML = "<p class='muted'>No tasks!🥳</p>";
    return;
  }
  let data = "";
  let data2 = "";
  let li = "";
  let li2 = "";
  tasks.forEach((e, i) => {
    let todoDate = e.deadline.split("T")[0];
    let todoTime = e.deadline.split("T")[1];
    if (e.category == currentCategory && !e.completed) {
      if (e.overdue) {
        for (let hash of e.hashtag) {
          li += `<li class="muted"><small>#${hash}</small></li>`;
        }
        data += `<div class="todocard overdue animate__animated animate__fadeInUp">
          <span class="overdue_badge"><small>Overdue!</small></span>
          <ul class="hashtag">${li}</ul>
          <h2 class="todoTitle">${e.title}</h2>
          <hr/>
          <div class="todoDeadline">
            <span><small><i class="bi bi-calendar"></i> ${todoDate}</small></span>
            <span><small><i class="bi bi-clock"></i> ${todoTime}</small></span>
          </div>
          <p class="todoCategory muted">${e.category}</p>
          <div class="cardBtnWrapper">
            <button id="delTodo" onclick="deleteTodo('${e.id}')"><i class="bi bi-trash3"></i></button>
            <button id="compTodo" onclick="completeTodo('${e.id}')"><i class="bi bi-check2-square"></i></button>
          </div>
        </div>`;
      } else {
        for (let hash of e.hashtag) {
          li += `<li class="muted"><small>#${hash}</small></li>`;
        }
        data += `<div class="todocard animate__animated animate__fadeInUp">
          <ul class="hashtag">${li}</ul>
          <h2 class="todoTitle">${e.title}</h2>
          <hr/>
          <div class="todoDeadline">
            <span><small><i class="bi bi-calendar"></i> ${todoDate}</small></span>
            <span><small><i class="bi bi-clock"></i> ${todoTime}</small></span>
          </div>
          <p class="todoCategory muted">${e.category}</p>
          <div class="cardBtnWrapper">
            <button id="delTodo" onclick="deleteTodo('${e.id}')"><i class="bi bi-trash3"></i></button>
            <button id="compTodo" onclick="completeTodo('${e.id}')"><i class="bi bi-check2-square"></i></button>
          </div>
        </div>`;
      }
    }
    li = "";
    if (e.category == currentCategory && e.completed) {
      for (let hash of e.hashtag) {
        li2 += `<li class="muted"><small>#${hash}</small></li>`;
      }
      data2 += `<div class="todocard completed animate__animated animate__fadeInUp">
          <ul class="hashtag">${li2}</ul>
          <h2 class="todoTitle">${e.title}</h2>
          <hr/>
          <div class="todoDeadline">
            <span><small><i class="bi bi-calendar"></i> ${todoDate}</small></span>
            <span><small><i class="bi bi-clock"></i> ${todoTime}</small></span>
          </div>
          <p class="todoCategory muted">${e.category}</p>
          <div class="cardBtnWrapper">
            <button id="delTodo" onclick="deleteTodo('${e.id}')"><i class="bi bi-trash3"></i></button>
          </div>
        </div>`;
    }
    li2 = "";
  });
  gridArea.innerHTML = data == "" ? "<p class='muted'>No tasks!🥳</p>" : data;
  completeGridArea.innerHTML =
    data2 == "" ? "<p class='muted'>Nothing to show.</p>" : data2;
};

const setFilterStyle = (h) => {
  if (currentFilteredHash == "") {
    currentFilteredHash = h;
    document.getElementById(currentFilteredHash).classList.add("active");
  } else {
    let prev = currentFilteredHash;
    currentFilteredHash = h;
    document.getElementById(prev).classList.remove("active");
    document.getElementById(currentFilteredHash).classList.add("active");
  }
};

const clearFilter = (h) => {
  populateTasks();
  document.getElementById(h).classList.remove("active");
  currentFilteredHash = "";
};

const filterTodo = (h) => {
  if (currentFilteredHash != h) {
    setFilterStyle(h);
    setAllTasks();
    let filteredArr = tasks.filter((item) => item.hashtag.includes(h));
    let data = "";
    let data2 = "";
    let li = "";
    let li2 = "";
    filteredArr.forEach((e, i) => {
      let todoDate = e.deadline.split("T")[0];
      let todoTime = e.deadline.split("T")[1];
      if (!e.completed) {
        if (e.overdue) {
          for (let hash of e.hashtag) {
            li += `<li class="muted"><small>#${hash}</small></li>`;
          }
          data += `<div class="todocard overdue animate__animated animate__fadeInUp">
          <span class="overdue_badge"><small>Overdue!</small></span>
          <ul class="hashtag">${li}</ul>
          <h2 class="todoTitle">${e.title}</h2>
          <hr/>
          <div class="todoDeadline">
            <span><small><i class="bi bi-calendar"></i> ${todoDate}</small></span>
            <span><small><i class="bi bi-clock"></i> ${todoTime}</small></span>
          </div>
          <p class="todoCategory muted">${e.category}</p>
          <div class="cardBtnWrapper">
            <button id="delTodo" onclick="deleteTodo('${e.id}')"><i class="bi bi-trash3"></i></button>
            <button id="compTodo" onclick="completeTodo('${e.id}')"><i class="bi bi-check2-square"></i></button>
          </div>
        </div>`;
        } else {
          for (let hash of e.hashtag) {
            li += `<li class="muted"><small>#${hash}</small></li>`;
          }
          data += `<div class="todocard animate__animated animate__fadeInUp">
          <ul class="hashtag">${li}</ul>
          <h2 class="todoTitle">${e.title}</h2>
          <hr/>
          <div class="todoDeadline">
            <span><small><i class="bi bi-calendar"></i> ${todoDate}</small></span>
            <span><small><i class="bi bi-clock"></i> ${todoTime}</small></span>
          </div>
          <p class="todoCategory muted">${e.category}</p>
          <div class="cardBtnWrapper">
            <button id="delTodo" onclick="deleteTodo('${e.id}')"><i class="bi bi-trash3"></i></button>
            <button id="compTodo" onclick="completeTodo('${e.id}')"><i class="bi bi-check2-square"></i></button>
          </div>
        </div>`;
        }
      }
      li = "";
      if (e.completed) {
        for (let hash of e.hashtag) {
          li2 += `<li class="muted"><small>#${hash}</small></li>`;
        }
        data2 += `<div class="todocard completed animate__animated animate__fadeInUp">
          <ul class="hashtag">${li2}</ul>
          <h2 class="todoTitle">${e.title}</h2>
          <hr/>
          <div class="todoDeadline">
            <span><small><i class="bi bi-calendar"></i> ${todoDate}</small></span>
            <span><small><i class="bi bi-clock"></i> ${todoTime}</small></span>
          </div>
          <p class="todoCategory muted">${e.category}</p>
          <div class="cardBtnWrapper">
            <button id="delTodo" onclick="deleteTodo('${e.id}')"><i class="bi bi-trash3"></i></button>
          </div>
        </div>`;
      }
      li2 = "";
    });
    gridArea.innerHTML = data == "" ? "<p class='muted'>No tasks!🥳</p>" : data;
    completeGridArea.innerHTML =
      data2 == "" ? "<p class='muted'>Nothing to show.</p>" : data2;
  } else {
    clearFilter(h);
  }
};

const populateHash = () => {
  let hashtags = localStorage.getItem("hashArray");
  if (hashtags == null || hashtags == []) {
    hashUL.innerHTML =
      "<span><i class='bi bi-filter'></i> Add tasks to show filter options.</span>";
  } else {
    let hash = hashtags.split(",");
    let data = "";
    hash.forEach((e, i) => {
      data += `<li id="${e}" onclick="filterTodo('${e}')">#${e}</li>`;
    });
    hashUL.innerHTML = data;
  }
};

const completeTodo = (id) => {
  setAllTasks();
  let currentArray = tasks.filter((item) => item.id == id);
  let restArray = tasks.filter((item) => item.id != id);
  currentArray[0].completed = true;
  let finalArray = restArray.concat(currentArray);
  localStorage.setItem("tasks", JSON.stringify(finalArray));
  populateTasks();
  clearFilter(currentFilteredHash);
};

const checkIfOverdue = () => {
  setAllTasks();
  if (tasks != null || tasks != [] || tasks.length != 0) {
    tasks.forEach((e, i) => {
      let todoDate = e.deadline.split("T")[0];
      let todoTime = e.deadline.split("T")[1];
      if (compareDateAndTime(todoDate, todoTime, e.id)) {
        if (!e.overdue) e.overdue = true;
      }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
};

const routineCheck = async () => {
  setAllTasks();
  tasks.forEach((e, i) => {
    let todoDate = e.deadline.split("T")[0];
    let todoTime = e.deadline.split("T")[1];
    compareDateAndTime(todoDate, todoTime, e.id);
  });
};

refreshBtn.onclick = () => {
  checkIfOverdue();
  populateTasks();
};
