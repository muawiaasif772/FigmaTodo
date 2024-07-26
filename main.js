// Task
// Functions
import {
  addNewTask,
  addCompletedTask,
  showPopup,
  hidePopup,
  removingValues,
} from './task.js';

// Variables
import {
  allAddedTasks,
  allCompleted,
  summary,
  dateTimeInput,
  description,
  reminderContainer,
} from './task.js';

// Location
// Functions
import { getLatLong, fetchData, displayFetchedData } from './location.js';

// variables
import { currLocCon, prevLocCon, coordinates } from './location.js';

const contentBox = document.querySelector('.content');
const locationContainer = document.querySelector('.location-container');
const taskDiv = document.querySelector('.task-btn');
const locationDiv = document.querySelector('.location-btn');
const fillField = document.getElementById('fill-field');
const taskBtn = document.getElementById('task');
const addTaskBtn = document.getElementById('btn-add');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');
const skipBtn = document.getElementById('skip-btn');
const reminLaterBtn = document.getElementById('remind-later-btn');
const locationBtn = document.getElementById('location');
const checkInBtn = document.getElementById('check');
const logoutBtn = document.getElementById('logout');

// Task Page
taskBtn.addEventListener('click', () => {
  locationContainer.classList.add('location-container-hide');
  locationDiv.classList.remove('active');
  taskDiv.classList.add('active');
  contentBox.classList.remove('content-hide');
});

addTaskBtn.addEventListener('click', () => {
  showPopup();
});

allAddedTasks.addEventListener('click', event => {
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

// Add Task
saveBtn.addEventListener('click', () => {
  if (summary.value && description.value && dateTimeInput.value) {
    fillField.classList.add('fill-hide');
    addNewTask(summary, dateTimeInput);
    removingValues();
    hidePopup();
  } else fillField.classList.remove('fill-hide');
});

cancelBtn.addEventListener('click', () => {
  removingValues();
  hidePopup();
});

// Reminder popup
skipBtn.addEventListener('click', () => {
  reminderContainer.classList.add('reminder-popup-hide');
});

reminLaterBtn.addEventListener('click', () => {
  reminderContainer.classList.add('reminder-popup-hide');
});

// Location page
locationBtn.addEventListener('click', () => {
  taskDiv.classList.remove('active');
  locationDiv.classList.add('active');
  locationContainer.classList.remove('location-container-hide');
  contentBox.classList.add('content-hide');
});

checkInBtn.addEventListener('click', async () => {
  checkInBtn.disabled = true;
  const timeoutPromise = new Promise(resolve => {
    setTimeout(() => {
      resolve(coordinates);
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
logoutBtn.addEventListener('click', () => {
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
