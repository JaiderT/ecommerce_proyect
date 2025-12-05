//script de login -techstore pro

//verificar que toda la pagina este cargada con los elementos
//html
document.addEventListener('DOMContentLoaded', function(){
    console.log('✅Pagina cargada correcta - Sistema listo');

    //creamos la constante de la Api
    const API_URL = "https://ecommerce-proyect-kul6.onrender.com/api/user/register";

    //Enviar los datos del formulario
    document.getElementById('register-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        //preparamos los elementos de la pagina
        const btn = document.getElementById('register-btn');
        const errorDiv = document.getElementById('register-error');
        const errorMsg = document.getElementById('register-error-message');
        errorDiv.classList.add('hidden');

        //recoger los campos del formulario
        const datos = {
            nombre: document.getElementById('nombre').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            confirmpassword: document.getElementById('confirm-password').value,
        };

        //validamos que los campos no esten vacios
        if(!datos.nombre || !datos.telefono || !datos.email || !datos.password){
            errorMsg.textContent = 'Faltan datos obligatorios';
            errorDiv.classList.remove('hidden');
            return;
        }

        if (datos.password !== datos.confirmpassword) {
            errorMsg.textContent = 'Las contraseñas no coinciden';
            errorDiv.classList.remove('hidden');
            return;
        }

        //cambia el boton mientras procesa
        btn.disabled = true;
        btn.textContent = 'Registrando...';

        //envia los datos al servidor
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(datos)
            });

            //recibir respuesta del servidor
            const resultado = await response.json();
            if (response.ok){
                console.log('✅ Registro exitoso');

                //guardar informacion
                localStorage.setItem("sesionActiva", "true");
                localStorage.setItem("usuario", JSON.stringify({
                    id: resultado.usuario?.id || resultado.id,
                    nombre: resultado.usuario?.nombre || datos.nombre,
                    telefono: resultado.usuario?.telefono || datos.telefono,
                    email: resultado.usuario?.email || datos.email
                }));

                //mensaje de exito
                errorDiv.className = 'bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg';
                errorMsg.textContent = '✅ Registrado, Redirigiendo...';
                errorDiv.classList.remove('hidden');

                //redirigir a login
                setTimeout(() => window.location.href = 'productos.html', 3000);

            } else {
                //credenciales incorrectas o usuario ya existe
                console.log('❌ Error del servidor:', resultado);
                errorMsg.textContent = resultado.message || 'Error al crear el usuario';
                errorDiv.classList.remove('hidden');
                btn.disabled = false;
                btn.textContent = 'Crear Cuenta';
            }

        } catch (error) {
            //si no hay conexion al servidor
            console.error('❌ Error de conexión:', error);
            errorMsg.textContent = 'Error de conexión con el servidor';
            errorDiv.classList.remove('hidden');
            btn.disabled = false;
            btn.textContent = 'Crear Cuenta';
        }
    });
});