// Script de registro - TechStore Pro

// Verificar que toda la página esté cargada con los elementos HTML
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Página cargada correcta - Sistema listo');

    // Creamos la constante de la API
    const API_URL = "http://localhost:8081/api/user/register";

    // Función para mostrar errores en campos específicos
    function mostrarError(campo, mensaje) {
        const errorElement = document.getElementById(`${campo}-error`);
        if (errorElement) {
            errorElement.textContent = mensaje;
            errorElement.classList.remove('hidden');
        }
    }

    // Función para limpiar todos los errores
    function limpiarErrores() {
        const errores = ['nombre', 'telefono', 'email', 'password', 'confirm-password'];
        errores.forEach(campo => {
            const errorElement = document.getElementById(`${campo}-error`);
            if (errorElement) {
                errorElement.classList.add('hidden');
            }
        });
    }

    // Validación del formulario
    function validarFormulario(datos) {
        limpiarErrores();
        let esValido = true;

        // Validar nombre (mínimo 3 caracteres)
        if (datos.nombre.length < 3) {
            mostrarError('nombre', 'El nombre debe tener al menos 3 caracteres');
            esValido = false;
        }

        // Validar teléfono (10 dígitos)
        const telRegex = /^\d{10}$/;
        if (!telRegex.test(datos.telefono)) {
            mostrarError('telefono', 'El teléfono debe tener exactamente 10 dígitos');
            esValido = false;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(datos.email)) {
            mostrarError('email', 'Por favor ingresa un correo electrónico válido');
            esValido = false;
        }

        // Validar contraseña (mínimo 6 caracteres)
        if (datos.password.length < 6) {
            mostrarError('password', 'La contraseña debe tener al menos 6 caracteres');
            esValido = false;
        }

        // Validar que las contraseñas coincidan
        if (datos.password !== datos.confirmPassword) {
            mostrarError('confirm-password', 'Las contraseñas no coinciden');
            esValido = false;
        }

        return esValido;
    }

    // Enviar los datos del formulario
    document.getElementById('register-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        // Preparamos los elementos de la página
        const btn = document.querySelector('button[type="submit"]');
        const terminos = document.getElementById('terminos');

        // Validar que se acepten los términos
        if (!terminos.checked) {
            alert('⚠️ Debes aceptar los términos y condiciones para continuar');
            return;
        }

        // Recoger los campos del formulario (según los IDs del HTML)
        const datos = {
            nombre: document.getElementById('nombre').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirm-password').value
        };

        // Validar el formulario
        if (!validarFormulario(datos)) {
            return;
        }

        // Preparar datos para enviar (sin confirmPassword)
        const datosEnvio = {
            nombre: datos.nombre,
            telefono: datos.telefono,
            email: datos.email,
            password: datos.password
        };

        // Cambia el botón mientras procesa
        btn.disabled = true;
        const textoOriginal = btn.innerHTML;
        btn.innerHTML = `
            <svg class="animate-spin h-5 w-5 mr-3 inline-block" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creando cuenta...
        `;

        // Envía los datos al servidor
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosEnvio)
            });

            // Recibir respuesta del servidor
            const resultado = await response.json();

            if (response.ok) {
                console.log('✅ 201 - Registro exitoso');

                // Guardar información del usuario
                localStorage.setItem("sesionActiva", "true");
                localStorage.setItem("usuario", JSON.stringify({
                    id: resultado.usuario?.id || resultado.id,
                    nombre: resultado.usuario?.nombre || datos.nombre,
                    telefono: resultado.usuario?.telefono || datos.telefono,
                    email: resultado.usuario?.email || datos.email
                }));

                // Mensaje de éxito
                btn.className = 'col-span-full flex justify-center items-center bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 shadow-lg';
                btn.innerHTML = `
                    <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    ¡Cuenta creada exitosamente!
                `;

                // Mostrar notificación de éxito
                const notification = document.createElement('div');
                notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl z-50 transform transition-all duration-300';
                notification.style.animation = 'slideIn 0.3s ease-out';
                notification.innerHTML = `
                    <div class="flex items-center">
                        <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <div>
                            <p class="font-bold">¡Bienvenido a TechStore Pro!</p>
                            <p class="text-sm">Redirigiendo al Login...</p>
                        </div>
                    </div>
                `;
                document.body.appendChild(notification);

                // Redirigir a productos después de 2 segundos
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);

            } else {
                // Error en el registro
                console.error('❌ Error en registro:', resultado.message);
                
                // Mostrar mensaje de error específico
                if (resultado.message?.toLowerCase().includes('email') || 
                    resultado.message?.toLowerCase().includes('correo')) {
                    mostrarError('email', resultado.message || 'Este correo ya está registrado');
                } else if (resultado.message?.toLowerCase().includes('teléfono') || 
                           resultado.message?.toLowerCase().includes('telefono')) {
                    mostrarError('tel', resultado.message || 'Este teléfono ya está registrado');
                } else {
                    // Mostrar alerta general
                    const notification = document.createElement('div');
                    notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-2xl z-50';
                    notification.innerHTML = `
                        <div class="flex items-center">
                            <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            <p>${resultado.message || 'Error al crear la cuenta. Por favor intenta nuevamente.'}</p>
                        </div>
                    `;
                    document.body.appendChild(notification);
                    setTimeout(() => notification.remove(), 4000);
                }

                btn.disabled = false;
                btn.innerHTML = textoOriginal;
            }

        } catch (error) {
            // Error de conexión al servidor
            console.error('❌ Error 500 - Error de conexión con el servidor:', error);
            
            // Mostrar notificación de error
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-2xl z-50';
            notification.innerHTML = `
                <div class="flex items-center">
                    <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    <div>
                        <p class="font-bold">Error de conexión</p>
                        <p class="text-sm">No se pudo conectar con el servidor. Verifica tu conexión.</p>
                    </div>
                </div>
            `;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 5000);
            
            btn.disabled = false;
            btn.innerHTML = textoOriginal;
        }
    });

    // Agregar estilos para la animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
});