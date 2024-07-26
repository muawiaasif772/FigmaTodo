const mainContainer = document.querySelector('.container');
const addTaskBtn = document.getElementById('btn-add');
const popupBox = document.querySelector('.popup-container');
const contentBox = document.querySelector('.content');
const locationContainer = document.querySelector('.location-container');
const taskDiv = document.querySelector('.task-btn');
const taskBtn = document.getElementById('task');
const locationDiv = document.querySelector('.location-btn');
const locationBtn = document.getElementById('location');
const logoutBtn = document.getElementById('logout');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');
const summary = document.getElementById('summary-text');
const description = document.getElementById('descrip-text');
const dateTimeInput = document.getElementById('date-text');
const allAddedTasks = document.querySelector('.all-added-tasks');
const fillField = document.getElementById('fill-field');
const allCompleted = document.querySelector('.all-completed');
const reminderContainer = document.getElementById('reminder-popup-id');
const skipBtn = document.getElementById('skip-btn');
const reminLaterBtn = document.getElementById('remind-later-btn');
const checkInBtn = document.getElementById('check');
const currLocCon = document.querySelector('.current-loc-con');
const prevLocCon = document.querySelector('.previous-loc-con');

// Task Page
const showPopup = function () {
  mainContainer.classList.add('overlay');
  popupBox.classList.remove('popup-hide');
};

const hidePopup = function () {
  mainContainer.classList.remove('overlay');
  popupBox.classList.add('popup-hide');
};

const removingValues = function () {
  summary.value = '';
  description.value = '';
  dateTimeInput.value = '';
};

const updateLocalStorage = function () {
  localStorage.setItem('incompletedTasks', allAddedTasks.innerHTML);
  localStorage.setItem('completedTasks', allCompleted.innerHTML);
};

const addNewTask = function (summary, dateTime) {
  const addedTaskDiv = document.createElement('div');
  addedTaskDiv.classList.add('added-task');

  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.name = 'added-checkbox';

  const currentTaskP = document.createElement('p');
  currentTaskP.classList.add('current-task');
  currentTaskP.textContent = summary.value;

  const taskTimeP = document.createElement('p');
  taskTimeP.classList.add('task-time');
  const [addDateTime, properTime] = dateTimeSet(dateTime.value);
  taskTimeP.textContent = addDateTime;

  // It is hide just for proper time format record
  const labelTime = document.createElement('label');
  labelTime.classList.add('label-hide');
  labelTime.textContent = properTime;

  // It is hide just to store text area description
  const textDescrip = document.createElement('label');
  textDescrip.classList.add('label-hide');
  textDescrip.id = 'text-area-descrip';
  textDescrip.textContent = description.value;

  addedTaskDiv.append(
    checkbox,
    currentTaskP,
    taskTimeP,
    labelTime,
    textDescrip
  );

  const firstChild = allAddedTasks.firstChild;

  allAddedTasks.insertBefore(addedTaskDiv, firstChild);
  updateLocalStorage();
};

const addCompletedTask = function (task) {
  const completedTaskDiv = document.createElement('div');
  completedTaskDiv.classList.add('completed-task');

  const img = document.createElement('img');
  img.src = '/Checked.svg';

  const label = document.createElement('label');
  label.textContent = task;

  completedTaskDiv.append(img, label);

  const firstOneChild = allCompleted.firstChild;

  allCompleted.insertBefore(completedTaskDiv, firstOneChild);
  updateLocalStorage();
};

const dateTimeSet = function (dateWritten) {
  const currentDateTime = new Date();
  const writtenDateTime = new Date(dateWritten);

  const properTime = `${writtenDateTime.getHours()}, ${writtenDateTime.getMinutes()}, ${writtenDateTime.getDate()}, ${writtenDateTime.getMonth()}, ${writtenDateTime.getFullYear()}`;

  const currentHour = writtenDateTime.getHours();
  const currentMinutes = writtenDateTime.getMinutes();
  const writtenDate = writtenDateTime.getDate();
  const currentMonthName = writtenDateTime.toLocaleString('en-US', {
    month: 'long',
  });

  currentDateTime.setHours(0, 0, 0, 0);
  writtenDateTime.setHours(0, 0, 0, 0);

  let dateTimeIs;
  if (currentDateTime.getTime() === writtenDateTime.getTime()) {
    dateTimeIs = `⏰ Today, ${currentHour}:${currentMinutes}`;
  } else if (
    writtenDateTime.getTime() - currentDateTime.getTime() ===
    24 * 60 * 60 * 1000
  ) {
    dateTimeIs = `⏰ Tommorow, ${currentHour}:${currentMinutes}`;
  } else {
    dateTimeIs = `⏰ ${writtenDate} ${currentMonthName}, ${currentHour}:${currentMinutes}`;
  }
  console.log(dateTimeIs);

  return [dateTimeIs, properTime];
};

const checkReminderTime = function () {
  const d = new Date();
  const dFormat = `${d.getHours()}, ${d.getMinutes()}, ${d.getDate()}, ${d.getMonth()}, ${d.getFullYear()}`;

  const addedTasksDivs = document.querySelectorAll('.added-task');

  if (addedTasksDivs.length > 0) {
    addedTasksDivs.forEach(div => {
      const currLabel = div.querySelector('label.label-hide').textContent;
      console.log(currLabel, dFormat);
      if (currLabel === dFormat) {
        const currSummary = div.querySelector('.current-task').textContent;
        const currDescription =
          div.querySelector('#text-area-descrip').textContent;
        console.log('Date Arrived');
        showReminder(currSummary, currDescription);
      }
    });
  }
};

setInterval(checkReminderTime, 50000);

const showReminder = function (summaryInput, descriptionText) {
  reminderContainer.classList.remove('reminder-popup-hide');

  document.getElementById('reminder-summary').textContent = summaryInput;
  document.getElementById('reminder-descrip').textContent = descriptionText;
};

// Location Page
const getLatLong = function () {
  return new Promise(resolve => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          resolve([latitude, longitude]);
        },
        () => resolve([29.3544, 71.6911])
      );
    } else resolve([29.3544, 71.6911]);
  });
};

const fetchData = async function (lat, lon) {
  const apiKey = '269e2523f92542e934133cd485093bd6';
  const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  return fetch(url)
    .then(response => {
      return response.json();
    })
    .then(data => {
      return data;
    })
    .catch(() => 'error');
};

const displayFetchedData = function (lat, lon, name, state, country) {
  const currentLocation = document.createElement('div');
  currentLocation.classList.add('current-loc-added');

  const label = document.createElement('label');
  label.textContent = '📍';

  const cityInfo = document.createElement('p');
  cityInfo.classList.add('city');
  cityInfo.textContent = `${name}, ${state}, ${country}`;

  const coordinates = document.createElement('p');
  coordinates.classList.add('coordinates');
  coordinates.textContent = `${lat}° N, ${lon}° E`;

  const existingCurrentLocation =
    currLocCon.querySelector('.current-loc-added');

  if (existingCurrentLocation) {
    existingCurrentLocation.classList.remove('current-loc-added');
    existingCurrentLocation.classList.add('previous-loc-added');
    prevLocCon.prepend(existingCurrentLocation);
    localStorage.setItem('previousLocation', prevLocCon.innerHTML);
  }

  currentLocation.append(label, cityInfo, coordinates);

  currLocCon.append(currentLocation);
  localStorage.setItem('currentLocation', currLocCon.innerHTML);
};

// Task
taskBtn.addEventListener('click', function () {
  locationContainer.classList.add('location-container-hide');
  locationDiv.classList.remove('active');
  taskDiv.classList.add('active');
  contentBox.classList.remove('content-hide');
});

addTaskBtn.addEventListener('click', function () {
  showPopup();
});

saveBtn.addEventListener('click', function () {
  if (summary.value && description.value && dateTimeInput.value) {
    fillField.classList.add('fill-hide');
    addNewTask(summary, dateTimeInput);
    removingValues();
    hidePopup();
  } else fillField.classList.remove('fill-hide');
});

cancelBtn.addEventListener('click', function () {
  removingValues();
  hidePopup();
});

allAddedTasks.addEventListener('click', function (event) {
  const target = event.target;

  // For Checkbox
  if (
    target.tagName.toUpperCase() === 'INPUT' &&
    target.type === 'checkbox' &&
    target.name === 'added-checkbox'
  ) {
    const parent = target.parentElement;
    const currentTask = parent.querySelector('.current-task').textContent;

    if (target.checked) {
      parent.remove();
      addCompletedTask(currentTask);
    }
  }
});

// Reminder popup
skipBtn.addEventListener('click', function () {
  reminderContainer.classList.add('reminder-popup-hide');
});

reminLaterBtn.addEventListener('click', function () {
  reminderContainer.classList.add('reminder-popup-hide');
});

// Location page
locationBtn.addEventListener('click', function () {
  taskDiv.classList.remove('active');
  locationDiv.classList.add('active');
  locationContainer.classList.remove('location-container-hide');
  contentBox.classList.add('content-hide');
});

checkInBtn.addEventListener('click', async function () {
  checkInBtn.disabled = true;
  const timeoutPromise = new Promise(resolve => {
    setTimeout(() => {
      resolve([29.3544, 71.6911]);
    }, 5000);
  });

  try {
    const [lati, long] = await Promise.race([getLatLong(), timeoutPromise]);
    const dataFetched = await fetchData(lati, long);

    const errorFetchP = document.querySelector('.current-loc-con > p');

    if (dataFetched === 'error') {
      errorFetchP.classList.remove('error-hide');
    } else {
      errorFetchP.classList.add('error-hide');

      const { lat, lon, name, state, country } = dataFetched[0];
      displayFetchedData(lat, lon, name, state, country);
    }
  } finally {
    checkInBtn.disabled = false;
  }
});

// logout
logoutBtn.addEventListener('click', function () {
  window.location.href = './login.html';
});

// On load local storage load
window.onload = () => {
  const {
    incompletedTasks,
    completedTasks,
    currentLocation,
    previousLocation,
  } = localStorage;

  if (incompletedTasks) allAddedTasks.innerHTML = incompletedTasks;
  if (completedTasks) allCompleted.innerHTML = completedTasks;
  if (currentLocation) currLocCon.innerHTML = currentLocation;
  if (previousLocation) prevLocCon.innerHTML = previousLocation;
};
