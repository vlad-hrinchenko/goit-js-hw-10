// Описаний в документації
import flatpickr from "flatpickr";
// Додатковий імпорт стилів
import "flatpickr/dist/flatpickr.min.css";

// Імпорт iziToast для сповіщень
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startButton = document.querySelector('[data-start]');
const dateTimePicker = document.getElementById('datetime-picker');

const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let countdown;

flatpickr(dateTimePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
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

  startCountdown(userTime);

  iziToast.success({
    title: 'Таймер запущено',
    message: 'Відлік часу розпочато.',
    position: 'topCenter'
  });
});

updateTimerDisplay(0);
