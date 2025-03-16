document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');

    if (!taskForm || !taskList) return; // Ensure elements exist

    taskForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent page refresh

        const taskInput = document.getElementById('task');
        const taskText = taskInput.value.trim();

        if (taskText === '') return; // Ignore empty input

        // Create a new task item
        const taskItem = document.createElement('li');
        taskItem.textContent = taskText;
        taskItem.classList.add('task-item');

        // Append task to the sidebar list
        taskList.appendChild(taskItem);

        // Clear input field
        taskInput.value = '';
    });
});


const questions = document.querySelectorAll(".question");

questions.forEach(function (question) {
    const btn = question.querySelector(".question-btn");
    btn.addEventListener("click", function () {
        question.classList.toggle("show-text");
    });
});

const toggleBtnLeft = document.querySelector(".sidebar-toggle-left");
const closeBtnLeft = document.querySelector(".close-btn-left");
const sidebarLeft = document.querySelector(".sidebar-left");

toggleBtnLeft.addEventListener("click", function () {
    sidebarLeft.classList.remove("show-sidebar-left");
});

closeBtnLeft.addEventListener("click", function () {
    sidebarLeft.classList.toggle("show-sidebar-left");
});

const toggleBtnRight = document.querySelector(".sidebar-toggle-right");
const closeBtnRight = document.querySelector(".close-btn-right");
const sidebarRight = document.querySelector(".sidebar-right");

toggleBtnRight.addEventListener("click", function () {
    sidebarRight.classList.remove("show-sidebar-right");
});

closeBtnRight.addEventListener("click", function () {
    sidebarRight.classList.toggle("show-sidebar-right");
});

// set initial count
let defaultHours = 0;
let defaultMinutes = 25;
let defaultSeconds = 0;
hoursLeft = defaultHours;
minutesLeft = defaultMinutes;
secondsLeft = defaultSeconds;
let timerOn = 0;
let timerReset = 0;
let interval;

// select value and buttons
const timerHours = document.querySelector('#timer-hours');
const timerColonLeft = document.querySelector('#timer-colon-left');
const timerMinutes = document.querySelector('#timer-minutes');
const timerColonRight = document.querySelector('#timer-colon-right');
const timerSeconds = document.querySelector('#timer-seconds');
const btns = document.querySelectorAll(".btn");
const audio = document.getElementById("play-audio");

btns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
        const styles = e.currentTarget.classList;
        
        if (styles.contains('default')) {
            defaultHours = hoursLeft;
            defaultMinutes = minutesLeft;
            defaultSeconds = secondsLeft;
        }  else if (styles.contains('start')) {
            if (!interval) {
                interval = setInterval(timer, 1000);
            }
            timerOn = 1;
        } else if (styles.contains('pause')) {
            if (timerOn ? timerOn = 0 : timerOn = 1);
        } else if (styles.contains('reset')) {
            hoursLeft = defaultHours;
            minutesLeft = defaultMinutes;
            secondsLeft = defaultSeconds;
            timerOn = 0;
            updateDisplay();
        } else if (styles.contains('clear')) {
            hoursLeft = 0;
            minutesLeft = 0;
            secondsLeft = 0;
            updateDisplay();
        } else if (styles.contains('+hour')) {
            if (hoursLeft == 99) {
                hoursLeft = 0;
                minutesLeft = 0;
                secondsLeft = 0;
            } else {
                hoursLeft++;
            }
            updateDisplay();
        } else if (styles.contains('-hour')) {
            if (hoursLeft == 0) {
                minutesLeft = 0;
                secondsLeft = 0;
            } else {
                hoursLeft--;
            }
            updateDisplay();
        } else if (styles.contains('+minute')) {
            if (hoursLeft == 99 && minutesLeft == 59) {
                hoursLeft = 0;
                minutesLeft = 0;
                secondsLeft = 0;
            } else if (minutesLeft == 59) {
                hoursLeft++;
                minutesLeft = 0;
            } else {
                minutesLeft++;
            }
            updateDisplay();
        } else if (styles.contains('-minute')) {
            if (hoursLeft == 0 && minutesLeft == 0) {
                secondsLeft = 0;
            } else if (minutesLeft == 0) {
                hoursLeft--;
                minutesLeft = 59;
            } else {
                minutesLeft--;
            }
            updateDisplay();
        } else if (styles.contains('+second')) {
            if (hoursLeft == 99 && minutesLeft == 59 &&
                secondsLeft == 59) {
                hoursLeft = 0;
                minutesLeft = 0;
                secondsLeft = 0;
            } else if (minutesLeft == 59 && secondsLeft == 59) {
                hoursLeft++;
                minutesLeft = 0;
                secondsLeft = 0;
            } else if (secondsLeft == 59) {
                minutesLeft++;
                secondsLeft = 0;
            } else {
                secondsLeft++;
            }
            updateDisplay();
        } else if (styles.contains('-second')) {
            if (hoursLeft == 0 && minutesLeft == 0 &&
                secondsLeft == 0) {
                return;
            } else if (minutesLeft == 0 && secondsLeft == 0) {
                hoursLeft--;
                minutesLeft = 59;
                secondsLeft = 59;
            } else if (secondsLeft == 0) {
                minutesLeft--;
                secondsLeft = 59;
            } else {
                secondsLeft--;
            }
            updateDisplay();
        }
        function timer() {
            if (!timerOn) {
                timer()
            }
            if (hoursLeft == 0 && minutesLeft == 0 &&
                secondsLeft == 0) {
                timerOn = 0;
                return;
            } else if (minutesLeft == 0 && secondsLeft == 0) {
                hoursLeft--;
                minutesLeft = 59;
                secondsLeft = 59;
            } else if (secondsLeft == 0) {
                minutesLeft--;
                secondsLeft = 59;
            } else {
                secondsLeft--;
            }
            updateDisplay();
        }
        function updateDisplay() {
            if (minutesLeft < 10) {
                timerColonLeft.textContent = ":0";
            } else {
                timerColonLeft.textContent = ":";
            }
            if (secondsLeft < 10) {
                timerColonRight.textContent = ":0";
            } else {
                timerColonRight.textContent = ":";
            }
            timerHours.textContent = hoursLeft;
            timerMinutes.textContent = minutesLeft;
            timerSeconds.textContent = secondsLeft;
        }
        if (styles.contains('audio')) {
            if (audio.paused ? audio.play() : audio.pause());
        }
    });
});

const modalLoginBtn = document.querySelector(".modal-login-btn");
const modalRegisterBtn = document.querySelector(".modal-register-btn");
const modalGuestBtn = document.querySelector(".modal-guest-btn");
const modal = document.querySelector(".modal-overlay");
const modalCloseBtn = document.querySelector(".modal-close-btn");

modal.classList.add("open-modal");

modalLoginBtn.addEventListener("click", function () {

});

modalRegisterBtn.addEventListener("click", function () {

});

modalGuestBtn.addEventListener("click", function () {
    modal.classList.remove("open-modal");
});

modalCloseBtn.addEventListener("click", function () {
    modal.classList.remove("open-modal");
});
