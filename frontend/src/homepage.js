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
let count = 0;

// select value and buttons
const value = document.querySelector('#value');
const btns = document.querySelectorAll(".btn");

btns.forEach(function (btn) {
    btn.addEventListener("click", function (e){
        const styles = e.currentTarget.classList;
        if (styles.contains('decrease')) {
            count--;
        } else if (styles.contains('increase')) {
            count++;
        } else {
            count = 0;
        }
        if (count > 0) {
            value.style.color = "green";
        }
        if (count < 0) {
            value.style.color = "red";
        }
        if (count == 0) {
            value.style.color = "#222";
        }
        value.textContent = count;
    });
});

const modalLoginBtn = document.querySelector(".modal-login-btn");
const modalRegisterBtn = document.querySelector(".modal-register-btn");
const modalGuestBtn = document.querySelector(".modal-guest-btn");
const modal = document.querySelector(".modal-overlay");
const modalCloseBtn = document.querySelector(".modal-close-btn");

modal.classList.add("open-modal");

modalLoginBtn.addEventListener("click", function () {

    setInterval(function () {
        modal.classList.add("open-modal");
    }, 200);
    for (let i = 1; i < 1000; i++) {
        setTimeout(function () {
            modal.classList.remove("open-modal");
        }, i * 400);
    }
});

modalRegisterBtn.addEventListener("click", function () {

    setInterval(function () {
        modal.classList.add("open-modal");
    }, 200);
    for (let i = 1; i < 1000; i++) {
        setTimeout(function () {
            modal.classList.remove("open-modal");
        }, i * 400);
    }
});

modalGuestBtn.addEventListener("click", function () {
    modal.classList.remove("open-modal");
});

modalCloseBtn.addEventListener("click", function () {
    modal.classList.remove("open-modal");
});
