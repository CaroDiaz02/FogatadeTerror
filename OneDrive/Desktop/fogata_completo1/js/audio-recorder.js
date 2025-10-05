// =========================================================
// Lógica para Grabadora de Audio (MediaRecorder + Firebase)
// =========================================================

// Importaciones necesarias:
// - storage y firestore vienen de tu app.js (¡asegúrate de que los estás exportando ahí!)
import { storage, firestore } from './app.js'; 
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-storage.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener Referencias del DOM
    const statusText = document.getElementById('recording-status');
    const titleInput = document.getElementById('titulo-texto'); // Usamos el input de texto para el título
    const btnRecord = document.getElementById('btn-record');
    const btnPause = document.getElementById('btn-pause');
    const btnStop = document.getElementById('btn-stop');
    const audioPlayback = document.getElementById('audio-playback');
    const btnSendAudio = document.getElementById('btn-send-audio');

    // 2. Variables de Estado de Grabación
    let mediaRecorder; 
    let audioChunks = []; 
    let audioBlob; 

    // ----------------------------------------------------
    // Funciones de Control de Grabación
    // ----------------------------------------------------

    async function startRecording() {
        if (!storage || !firestore) {
            statusText.textContent = "Error: Firebase (Storage/Firestore) no está disponible. ¿Revisaste app.js?";
            return;
        }

        try {
            // Pedir acceso al micrófono
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            mediaRecorder = new MediaRecorder(stream);
            
            // Limpiar datos anteriores
            audioChunks = [];
            audioPlayback.style.display = 'none';

            // Manejar datos disponibles (chunk por chunk)
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            // Manejar la detención de la grabación
            mediaRecorder.onstop = () => {
                audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                
                // Mostrar el reproductor al usuario
                const audioUrl = URL.createObjectURL(audioBlob);
                audioPlayback.src = audioUrl;
                audioPlayback.style.display = 'block';

                statusText.textContent = 'Grabación finalizada. ¡Escucha y envía!';
                btnSendAudio.disabled = false; // Habilitar el envío

                // Detener la pista del micrófono para liberar recursos
                stream.getTracks().forEach(track => track.stop());
            };
            
            // Iniciar la grabación
            mediaRecorder.start();

            // Actualizar la UI
            statusText.textContent = 'Grabando... 🔴';
            btnRecord.disabled = true;
            btnPause.disabled = false;
            btnStop.disabled = false;

        } catch (err) {
            console.error('Error al acceder al micrófono: ', err);
            statusText.textContent = 'Error: No se pudo acceder al micrófono. Verifica los permisos.';
        }
    }

    function pauseRecording() {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.pause();
            statusText.textContent = 'Grabación pausada ⏸️';
            btnPause.innerHTML = '<i class="fas fa-play"></i> Reanudar';
        } else if (mediaRecorder && mediaRecorder.state === 'paused') {
            mediaRecorder.resume();
            statusText.textContent = 'Grabando... 🔴';
            btnPause.innerHTML = '<i class="fas fa-pause"></i> Pausar';
        }
    }

    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            btnRecord.disabled = false;
            btnPause.disabled = true;
            btnStop.disabled = true;
            btnPause.innerHTML = '<i class="fas fa-pause"></i> Pausar';
        }
    }

    // ----------------------------------------------------
    // Subida a Firebase (Storage + Firestore)
    // ----------------------------------------------------

    async function sendAudio() {
        const audioTitle = titleInput.value.trim();

        if (!audioBlob || audioTitle.length < 3) {
            alert("Por favor, graba un audio y añade un título de al menos 3 caracteres.");
            return;
        }
        
        btnSendAudio.disabled = true;
        statusText.textContent = 'Subiendo audio y guardando relato... ⏳';

        const sanitizedTitle = audioTitle.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_');
        const timestamp = Date.now();
        const storagePath = `audios/${sanitizedTitle}_${timestamp}.webm`;
        const storageRef = ref(storage, storagePath);

        try {
            // 1. Subir a Firebase Storage
            await uploadBytes(storageRef, audioBlob);
            
            // 2. Obtener la URL de descarga para guardarla en Firestore
            const audioURL = await getDownloadURL(storageRef);

            // 3. Guardar Metadatos en Firestore
            const relatosCollection = collection(firestore, "relatos");
            await addDoc(relatosCollection, {
                titulo: audioTitle,
                tipo: "audio",
                autor: "Anónimo (o implementa Auth)",
                fecha: new Date(),
                audioURL: audioURL // La URL que necesitamos para reproducir el relato
            });

            statusText.textContent = `¡Relato "${audioTitle}" guardado y listo para ser escuchado!`;
            
            // 4. Limpiar UI y variables
            titleInput.value = '';
            audioPlayback.style.display = 'none';
            audioBlob = null; // Reiniciar la variable para una nueva grabación

        } catch (error) {
            console.error('Error durante el proceso de subida:', error);
            statusText.textContent = 'Error al subir. Revisa las reglas de Storage/Firestore en la consola.';
            btnSendAudio.disabled = false;
        }
    }

    // ----------------------------------------------------
    // Asignación de Eventos
    // ----------------------------------------------------

    if (btnRecord) {
        btnRecord.addEventListener('click', startRecording);
        btnPause.addEventListener('click', pauseRecording);
        btnStop.addEventListener('click', stopRecording);
        btnSendAudio.addEventListener('click', sendAudio);
    }
});