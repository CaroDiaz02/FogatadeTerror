// Este código maneja la inicialización de Firebase, la lógica de los menús desplegables
// y la carga/visualización de relatos desde Firestore.

// --- 1. Inicialización de Firebase y Exportaciones ---
// Importaciones de los módulos de Firebase (asegúrate de que las versiones sean compatibles)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
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

// 🔑 CLAVE: Declaramos y exportamos las instancias para usarlas en otros módulos (como audio-recorder.js)
export let analytics, auth, firestore, storage;

try {
    const app = initializeApp(firebaseConfig);
    
    // Asignamos las instancias a las variables exportadas
    analytics = getAnalytics(app); 
    auth = getAuth(app);
    firestore = getFirestore(app);
    storage = getStorage(app); 
    
    console.log("Firebase inicializado con éxito y exportado.");

} catch (error) {
    console.error("Error al inicializar Firebase. ¿Faltan las credenciales?", error);
}

// =========================================================
// LÓGICA DE INTERFAZ Y FIRESTORE
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- 2. Lógica para Menús Desplegables del Sidebar Derecho ---
    
    const menuContainers = document.querySelectorAll('.menu-desplegable');

    menuContainers.forEach(container => {
        const title = container.querySelector('h3');
        const content = container.querySelector('.right-menu-content');
        const icon = title ? title.querySelector('i') : null;
        
        // Inicializar cerrados
        if (content) {
            content.style.display = 'none';
        }
        
        if (icon) {
             icon.style.transform = 'rotate(0deg)';
        }

        if (title && content) {
            title.addEventListener('click', () => {
                const isVisible = content.style.display === 'block';
                content.style.display = isVisible ? 'none' : 'block';

                if (icon) {
                    icon.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
                }
            });
        }
    });

    // ----------------------------------------------------
    // 3. Lógica para Cargar Relatos desde Firestore
    // ----------------------------------------------------
    
    // Función de utilidad para mostrar el tiempo transcurrido
    function formatTime(date) {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `Hace ${days} día${days > 1 ? 's' : ''}`;
        if (hours > 0) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
        if (minutes > 0) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
        return `Hace unos segundos`;
    }

    async function loadRelatos() {
        // La instancia de firestore ya fue asignada globalmente arriba
        if (!firestore) {
            console.error("Firestore no está inicializado. No se pueden cargar relatos.");
            return;
        }

        const container = document.getElementById('contenidos-list');
        // Asegurar que el contenedor existe y limpiar contenido previo (ejemplo manual)
        if (container) {
             container.innerHTML = '<h2>Últimos Relatos 🔥</h2>'; 
        } else {
             console.error("No se encontró el contenedor de contenidos (ID: contenidos-list).");
             return;
        }

        try {
            // 1. Crear la consulta: ordenar por fecha descendente
            const relatosRef = collection(firestore, "relatos");
            const q = query(relatosRef, orderBy("fecha", "desc"));
            
            // 2. Ejecutar la consulta
            const snapshot = await getDocs(q);
            
            if (snapshot.empty) {
                container.innerHTML += '<p class="no-content-msg">Aún no hay relatos. ¡Sé el primero en grabar uno!</p>';
                return;
            }

            // 3. Recorrer los resultados y crear el HTML
            snapshot.forEach((doc) => {
                const relato = doc.data();
                const fecha = relato.fecha ? relato.fecha.toDate() : new Date();
                const tiempoPublicacion = formatTime(fecha);
                
                let mediaElement = '';
                let buttonText = 'Escuchar y comentar';

                // Mostrar el reproductor de audio si el relato es de tipo 'audio'
                if (relato.tipo === 'audio' && relato.audioURL) {
                    mediaElement = `
                        <audio controls>
                            <source src="${relato.audioURL}" type="audio/webm">
                            Tu navegador no soporta el elemento de audio.
                        </audio>`;
                } 

                const cardHTML = `
                    <article class="relato-card" data-id="${doc.id}">
                        <h3>${relato.titulo}</h3>
                        <p class="meta">Por: ${relato.autor} | Categoría: Audio | <i class="far fa-clock"></i> ${tiempoPublicacion}</p>
                        ${mediaElement}
                        <button>${buttonText}</button>
                    </article>`;

                container.innerHTML += cardHTML;
            });

        } catch (error) {
            console.error("Error al cargar los relatos desde Firestore:", error);
            container.innerHTML += '<p class="error-msg">Error al cargar los datos. Revisa la consola y las reglas de Firestore.</p>';
        }
    }

    // Ejecutar la función cuando el DOM esté listo
    loadRelatos();
    
    console.log('App.js ha finalizado la configuración de menús fijos y ha iniciado la carga de relatos.');
});