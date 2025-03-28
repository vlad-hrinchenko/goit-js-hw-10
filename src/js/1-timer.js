// Імпорт бібліотек
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startButton = document.querySelector('[data-start]');
const dateTimePicker = document.getElementById('datetime-picker');

const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let countdown = null;

// Додаємо стилі для неактивної кнопки
const disableButton = () => {
  startButton.disabled = true;
  startButton.classList.add('disabled');
};

const enableButton = () => {
  startButton.disabled = false;
  startButton.classList.remove('disabled');
};

// Ініціалізація flatpickr
flatpickr(dateTimePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const userTime = selectedDates[0]?.getTime();
    const now = new Date().getTime();

    if (!userTime || userTime <= now) {
      disableButton();
      iziToast.error({
        title: 'Помилка',
        message: 'Будь ласка, виберіть дату в майбутньому!',
        position: 'topCenter'
      });
    } else {
      enableButton();
    }
  },
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / minute);
  const seconds = Math.floor((ms % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimerDisplay(time) {
  const { days, hours, minutes, seconds } = convertMs(time);

  daysEl.textContent = String(days).padStart(2, '0');
  hoursEl.textContent = String(hours).padStart(2, '0');
  minutesEl.textContent = String(minutes).padStart(2, '0');
  secondsEl.textContent = String(seconds).padStart(2, '0');
}

function startCountdown(targetTime) {
  clearInterval(countdown);

  countdown = setInterval(() => {
    const now = new Date().getTime();
    const remainingTime = targetTime - now;

    if (remainingTime <= 0) {
      clearInterval(countdown);
      updateTimerDisplay(0);

      iziToast.show({
        title: 'Час вийшов!',
        message: 'Відлік завершено.',
        position: 'topCenter',
        color: 'red'
      });

      enableButton();
      dateTimePicker.disabled = false;

      return;
    }

    updateTimerDisplay(remainingTime);
  }, 1000);
}

startButton.addEventListener('click', () => {
  const userTime = new Date(dateTimePicker.value).getTime();
  const now = new Date().getTime();

  if (isNaN(userTime) || userTime <= now) {
    iziToast.error({
      title: 'Помилка',
      message: 'Будь ласка, виберіть коректну дату в майбутньому!',
      position: 'topCenter'
    });
    return;
  }

  // Деактивація елементів
  disableButton();
  dateTimePicker.disabled = true;

  startCountdown(userTime);

  iziToast.success({
    title: 'Таймер запущено',
    message: 'Відлік часу розпочато.',
    position: 'topCenter'
  });
});

// Початкове оновлення таймера
updateTimerDisplay(0);

// Деактивація кнопки при завантаженні сторінки
disableButton();
