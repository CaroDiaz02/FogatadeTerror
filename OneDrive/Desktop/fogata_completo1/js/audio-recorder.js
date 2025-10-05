document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // Estructura y Lógica Placeholder para Grabadora de Audio
    // (Funcionalidad real de MediaRecorder requiere más código)
    // ----------------------------------------------------
    
    const statusText = document.getElementById('recording-status');
    const btnRecord = document.getElementById('btn-record');
    const btnPause = document.getElementById('btn-pause');
    const btnStop = document.getElementById('btn-stop');
    const btnSendAudio = document.getElementById('btn-send-audio');
    
    let isRecording = false;

    // Función de prueba para simular el inicio de la grabación
    const startRecording = () => {
        isRecording = true;
        statusText.textContent = 'Grabando... 🔴';
        btnRecord.disabled = true;
        btnPause.disabled = false;
        btnStop.disabled = false;
        btnSendAudio.disabled = true;
        console.log("Grabación iniciada (Simulado)");
    };

    // Función de prueba para simular la detención
    const stopRecording = () => {
        isRecording = false;
        statusText.textContent = 'Grabación detenida. Listo para enviar.';
        btnRecord.disabled = false;
        btnPause.disabled = true;
        btnStop.disabled = true;
        btnSendAudio.disabled = false; // Habilitamos el envío
        console.log("Grabación detenida (Simulado)");
    };

    // Función de prueba para simular la pausa
    const pauseRecording = () => {
        if (isRecording) {
            statusText.textContent = 'Grabación pausada ⏸️';
            isRecording = false;
            // En una implementación real, aquí se llamaría a mediaRecorder.pause()
            console.log("Grabación pausada (Simulado)");
        } else {
            statusText.textContent = 'Reanudando... 🔴';
            isRecording = true;
            // En una implementación real, aquí se llamaría a mediaRecorder.resume()
            console.log("Grabación reanudada (Simulado)");
        }
    };

    // Event Listeners
    if (btnRecord) {
        btnRecord.addEventListener('click', startRecording);
        btnPause.addEventListener('click', pauseRecording);
        btnStop.addEventListener('click', stopRecording);
        
        btnSendAudio.addEventListener('click', () => {
            alert('¡Audio simulado enviado con éxito! (Faltan la lógica de Firebase y la captura real del micrófono)');
            btnSendAudio.disabled = true;
            statusText.textContent = 'Presiona Grabar para empezar...';
        });
    }

    // Lógica para Formulario de Texto (Solo preventDefault para simular envío)
    const formHistoria = document.getElementById('form-historia');
    if (formHistoria) {
        formHistoria.addEventListener('submit', (e) => {
            e.preventDefault();
            const titulo = document.getElementById('titulo-texto').value;
            alert(`Historia de texto "${titulo}" enviada con éxito! (Simulado)`);
            formHistoria.reset();
        });
    }
});