// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";

document.querySelector('.form').addEventListener('submit', function (event) {
      event.preventDefault(); 

      const delay = parseInt(event.target.elements.delay.value); 
      const state = event.target.elements.state.value; 

      
      const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          if (state === 'fulfilled') {
            resolve(delay);
          } else {
            reject(delay); 
          }
        }, delay);
      });

      promise
        .then((delay) => {
          iziToast.success({
            title: 'Success',
            message: `✅ Fulfilled promise in ${delay}ms`,
            position: 'topCenter'
          });
        })
        .catch((delay) => {
          iziToast.error({
            title: 'Error',
            message: `❌ Rejected promise in ${delay}ms`,
            position: 'topCenter'
          });
        });
    });