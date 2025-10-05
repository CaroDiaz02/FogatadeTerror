// Este código maneja la inicialización de Firebase y la lógica de los nuevos menús desplegables fijos.

// --- 1. Inicialización de Firebase ---
// Importaciones de los módulos de Firebase (asegúrate de que las versiones sean compatibles)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-storage.js";

// !!! IMPORTANTE: REEMPLAZA ESTAS CLAVES CON LA CONFIGURACIÓN REAL DE TU PROYECTO
const firebaseConfig = {
    apiKey: "TU_API_KEY_REAL",
    authDomain: "TU_AUTH_DOMAIN_REAL",
    projectId: "TU_PROJECT_ID_REAL",
    storageBucket: "TU_STORAGE_BUCKET_REAL",
    messagingSenderId: "TU_MESSAGING_SENDER_ID_REAL",
    appId: "TU_APP_ID_REAL",
    measurementId: "TU_MEASUREMENT_ID_REAL"
};

try {
    const app = initializeApp(firebaseConfig);
    // Asignamos las instancias a constantes
    const analytics = getAnalytics(app); 
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    const storage = getStorage(app);
    
    console.log("Firebase inicializado con éxito.");

    // Puedes exportar o usar estas instancias en otros módulos si es necesario
    // export { app, analytics, auth, firestore, storage }; 

} catch (error) {
    console.error("Error al inicializar Firebase. ¿Faltan las credenciales?", error);
}


document.addEventListener('DOMContentLoaded', () => {

    // --- 2. Lógica para Menús Desplegables del Sidebar Derecho ---
    
    // Selecciona todos los contenedores de menús desplegables
    const menuContainers = document.querySelectorAll('.menu-desplegable');

    menuContainers.forEach(container => {
        // Obtenemos el título (h3) y el contenido (nav.right-menu-content)
        const title = container.querySelector('h3');
        const content = container.querySelector('.right-menu-content');
        const icon = title ? title.querySelector('i') : null;
        
        // Inicializa el estado: empezamos con el contenido oculto
        if (content) {
            content.style.display = 'none';
        }
        
        // El icono de la flecha debe apuntar hacia abajo (cerrado)
        if (icon) {
             icon.style.transform = 'rotate(0deg)';
        }

        if (title && content) {
            title.addEventListener('click', () => {
                // Alternar la visibilidad del contenido
                const isVisible = content.style.display === 'block';
                content.style.display = isVisible ? 'none' : 'block';

                // Alternar la rotación del icono de flecha
                if (icon) {
                    icon.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
                }
            });
        }
    });


    // --- 3. Lógica Eliminada (Antiguo Botón Desplegable y Linterna) ---
    // La función toggleMenu y el listener de mousemove para la linterna han sido
    // eliminados, ya que la estructura HTML y el CSS ahora manejan el diseño fijo
    // y la linterna está desactivada.
    

    console.log('App.js ha finalizado la configuración de Firebase y los menús fijos.');
});