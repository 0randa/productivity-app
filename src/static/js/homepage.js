const toggleBtn = document.querySelector(".sidebar-toggle");
const closeBtn = document.querySelector(".close-btn");
const sidebar = document.querySelector(".sidebar");

toggleBtn.addEventListener("click", function () {
    // if (sidebar.classList.contains("show-sidebar")) {
    //     sidebar.classList.remove("show-sidebar")
    // } else {
    //     sidebar.classList.add("show-sidebar")
    // }
    sidebar.classList.toggle("show-sidebar");
});

closeBtn.addEventListener("click", function () {
    sidebar.classList.remove("show-sidebar");
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
