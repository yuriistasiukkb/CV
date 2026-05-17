// ==========================================================================
// ЗАВДАННЯ 1: Отримання інформації про браузер/ОС, збереження її у localStorage
// та відображення цих даних у футері сторінки.
// ==========================================================================
const systemInfo = navigator.userAgent;
console.log("Системна інформація:", systemInfo);
localStorage.setItem("SysInfo", systemInfo);

const sysInfo = localStorage.getItem("SysInfo");
const footerInfo = document.getElementById("footer-info");
footerInfo.textContent = "Ваша система: " + sysInfo;


// ==========================================================================
// ЗАВДАННЯ 2: Асинхронний запит на сервер (через Fetch API) для отримання
// коментарів згідно з номером варіанту та їх динамічне відображення на сторінці.
// ==========================================================================
async function loadComments() {
    const commentsContainer = document.getElementById("comments-container");

    const variantNumber = 18;
    const apiUrl = `https://jsonplaceholder.typicode.com/posts/${variantNumber}/comments`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Помилка HTTP: ${response.status}`);
        }

        const comments = await response.json();
        commentsContainer.innerHTML = '';

        comments.forEach(comment => {
            const card = document.createElement("div");
            card.className = "comment-card";

            card.innerHTML = `
                <div class="comment-name">${comment.name}</div>
                <div class="comment-email">${comment.email}</div>
                <div class="comment-body">«${comment.body}»</div>
            `;

            commentsContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Помилка завантаження:", error);
        commentsContainer.innerHTML = `<p class="loading-text" style="color:#e74c3c;">Не вдалося завантажити відгуки :(</p>`;
    }
}

loadComments();


// ==========================================================================
// ЗАВДАННЯ 3: Робота з таймером. Показ модального вікна з формою зворотного
// зв'язку через 1 хвилину (60000 мілісекунд) та обробка закриття вікна.
// ==========================================================================
function showModal() {
    const modal = document.getElementById("feedback-modal");
    if (modal) modal.classList.add("show");
}

function closeModal() {
    const modal = document.getElementById("feedback-modal");
    if (modal) modal.classList.remove("show");
}

setTimeout(showModal, 60000);

const closeBtn = document.getElementById("close-modal");
if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
}


// ==========================================================================
// ЗАВДАННЯ 4: Перехід на нічний/денний режим. Автоматичне визначення теми
// залежно від поточного часу (07:00-21:00) та можливість ручного перемикання.
// ==========================================================================
function initThemeToggle() {
    const themeBtn = document.getElementById("theme-toggle");
    const body = document.body;

    const currentHour = new Date().getHours();
    const isNightTime = currentHour < 7 || currentHour >= 21;

    if (isNightTime) {
        body.classList.add("dark-theme");
        themeBtn.textContent = "☀️";
    } else {
        body.classList.remove("dark-theme");
        themeBtn.textContent = "🌙";
    }

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            body.classList.toggle("dark-theme");
            themeBtn.textContent = body.classList.contains("dark-theme") ? "☀️" : "🌙";
        });
    }
}

initThemeToggle();


// ==========================================================================
// ЛАБОРАТОРНА 6: Відправка форми зворотного зв'язку через POST /api/contact
// (NestJS бекенд + Mailjet API)
// ==========================================================================
const feedbackForm = document.getElementById("feedback-form");
const submitBtn = document.getElementById("submit-btn");
const formError = document.getElementById("form-error");

function showError(msg) {
    formError.textContent = msg;
    formError.style.display = 'block';
}

function hideError() {
    formError.style.display = 'none';
}

if (feedbackForm) {
    feedbackForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        hideError();

        const name    = feedbackForm.querySelector('#name').value.trim();
        const email   = feedbackForm.querySelector('#email').value.trim();
        const subject = feedbackForm.querySelector('#subject').value.trim();
        const message = feedbackForm.querySelector('#message').value.trim();

        // Клієнтська валідація
        if (!name || name.length < 2) {
            return showError("Ім'я має містити щонайменше 2 символи.");
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return showError("Введіть коректний email.");
        }
        if (!subject || subject.length < 2) {
            return showError("Тема має містити щонайменше 2 символи.");
        }
        if (!message || message.length < 10) {
            return showError("Повідомлення має містити щонайменше 10 символів.");
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Відправлення...';

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, subject, message }),
            });

            const data = await res.json();

            if (!res.ok) {
                const errMsg = Array.isArray(data.message)
                    ? data.message.join('; ')
                    : (data.message || 'Помилка сервера');
                throw new Error(errMsg);
            }

            submitBtn.textContent = 'Відправлено!';
            feedbackForm.reset();
            setTimeout(closeModal, 2000);

        } catch (err) {
            showError(err.message || 'Не вдалося відправити повідомлення. Спробуйте ще раз.');
            submitBtn.textContent = 'Відправити';
            submitBtn.disabled = false;
        }
    });
}
