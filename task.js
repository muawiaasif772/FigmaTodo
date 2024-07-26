const mainContainer = document.querySelector('.container');
const popupBox = document.querySelector('.popup-container');

export const allAddedTasks = document.querySelector('.all-added-tasks');
export const allCompleted = document.querySelector('.all-completed');
export const reminderContainer = document.getElementById('reminder-popup-id');
export const summary = document.getElementById('summary-text');
export const dateTimeInput = document.getElementById('date-text');
export const description = document.getElementById('descrip-text');

export const showPopup = function () {
  mainContainer.classList.add('overlay');
  popupBox.classList.remove('popup-hide');
};

export const hidePopup = function () {
  mainContainer.classList.remove('overlay');
  popupBox.classList.add('popup-hide');
};

export const removingValues = function () {
  summary.value = '';
  description.value = '';
  dateTimeInput.value = '';
};

export const updateLocalStorage = function () {
  localStorage.setItem('incompletedTasks', allAddedTasks.innerHTML);
  localStorage.setItem('completedTasks', allCompleted.innerHTML);
};

export const dateTimeSet = function (dateWritten) {
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

// Run after every 0:50 minute, as long window is open
setInterval(checkReminderTime, 50000);

const showReminder = function (summaryInput, descriptionText) {
  reminderContainer.classList.remove('reminder-popup-hide');

  document.getElementById('reminder-summary').textContent = summaryInput;
  document.getElementById('reminder-descrip').textContent = descriptionText;
};

export const addNewTask = function (summary, dateTime) {
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

export const addCompletedTask = function (task) {
  const completedTaskDiv = document.createElement('div');
  completedTaskDiv.classList.add('completed-task');

  const img = document.createElement('img');
  img.src = './icons/Checked.svg';

  const label = document.createElement('label');
  label.textContent = task;

  completedTaskDiv.append(img, label);

  const firstOneChild = allCompleted.firstChild;

  allCompleted.insertBefore(completedTaskDiv, firstOneChild);
  updateLocalStorage();
};
