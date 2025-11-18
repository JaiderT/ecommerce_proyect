//script de login -techstore pro

//verificar que toda la pagina este cargada con los elementos
//html
document.addEventListener('DOMContentLoaded', function(){
    console.log('✅Pagina cargada correcta - Sistema listo');

    //creamos la constante de la Api

    const API_URL="http://localhost:8081/api/login";

    //Enviar los datos del formulario

    document.getElementById('login-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        //preparamos los elementos de la pagina
        const btn = document.getElementById('login-btn');
        const errorDiv = document.getElementById('login-error');
        const errorMsg = document.getElementById('login-error-message');

        errorDiv.classList.add('hidden');

        //recoger los campos del formulario

        const datos ={
            email:document.getElementById('email').value.trim(),
            password:document.getElementById('password').value
        };

        //validamos que los campos no esten vacios

        if(!datos.email|| !datos.password){
            errorMsg.textContent='por favor completa los datos';
            errorDiv.classList.remove('hidden');
            return;
        }

        //cambia el boton mientras procesa

        btn.disabled=true;
        btn.textContent='Iniciando sesion.....';

        //envia los datos al servidor

        try {
            const response= await fetch(API_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(datos)
            });
            //recibir repuesta del servidor
            const resultado=await response.json();
            if (response.ok){
                console.log('201- Inicio de sesion exitoso');

                //guardar informacion
                localStorage.setItem("sesionActiva", "true");
                localStorage.setItem("usuario", JSON.stringify({
                    id: resultado.usuario.id,
                    nombre: resultado.usuario.nombre,
                    telefono: resultado.usuario.telefono,
                    email: resultado.usuario.email
                }));
                //mensaje de exito
                errorDiv.className='bg-green-50 border-green-200 text-green-800 px-4 py-3 rounded-lg';
                errorMsg.textContent='Inicio de sesion , Redirigiendo......';
                errorDiv.classList.remove('hidden');

                //redirigir a productos

                setTimeout(()=>window.location.href = 'productos.html', 3000)
                //credenciales incorrectas
            } else {
                errorMsg.textContent=resultado.message || 'Credenciales Incorrecta';
                errorDiv.classList.remove('hidden');
                btn.disabled=false;
                btn.innerHTML='iniciar sesion';
            }
            //si no hay conexion al servidor
        } catch (error){
            console.error('Error 404- Error de conexion con el servidor')
            errorMsg.textContent='Error conexion de servidor';
            errorDiv.classList.remove('hidden');
            btn.disabled=false;
            btn.innerHTML='iniciar sesion';
            }
    
        });
});