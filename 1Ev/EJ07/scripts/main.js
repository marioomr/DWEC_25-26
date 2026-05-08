document.addEventListener('DOMContentLoaded', () => {
    console.log('%cDocumento listo.', 'color: green; font-size: 16px; font-weight: bold;');
    console.log('%cEscribe las soluciones en main.js', 'color: red; font-size: 18px; font-weight: bold;');


    // --- Solución Ejercicio 1 y 4 ---

// Ejercicio 1
const outerBox = document.getElementById("outer-box");

outerBox.addEventListener("click", function(event) {
    console.log("Elemento pulsado (event.target.id):", event.target.id);
    console.log("Elemento que gestiona el evento (event.currentTarget.id):", event.currentTarget.id);
    if (event.target.classList.contains("box")) {
        event.target.style.backgroundColor = "green";
    }
});


// Ejercicio 4
const middleBox = document.getElementById("middle-box");

middleBox.addEventListener("click", function(event) {
    console.log("Click en middle-box — parando propagación");
    event.stopPropagation();

   
    middleBox.style.backgroundColor = "yellow";
});


    // --- Solución Ejercicio 2 ---

const testLink = document.getElementById('test-link');

testLink.addEventListener('click', function(event) {
    event.preventDefault();
    console.log('Navegación prevenida');
});
    // --- Solución Ejercicio 3 ---

    const backToTopBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 250) {
        backToTopBtn.classList.remove('hidden');
    } else {
        backToTopBtn.classList.add('hidden');
    }
});
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});


    // --- Solución Ejercicio 5 ---

    const notificationBtn = document.getElementById('notification-btn');
const notificationArea = document.getElementById('notification-area');

document.body.addEventListener('notification', (event) => {
    const { message, date } = event.detail;
    notificationArea.innerHTML = `<p>${message} <br><small>${date}</small></p>`;
});
notificationBtn.addEventListener('click', () => {
    const event = new CustomEvent('notification', {
        detail: {
            message: '¡Nueva notificación!',
            date: new Date().toLocaleString()
        }
    });
    document.body.dispatchEvent(event);
});

});