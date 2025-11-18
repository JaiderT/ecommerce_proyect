// funcion de visibilidad del ojito

document.getElementById('toggle-password').addEventListener('click', function(){
    const passwordInput=document.getElementById('password');
    const eyeOpen=document.getElementById('eye-icon-open');
    const eyeClosed=document.getElementById('eye-icon-closed');

    // verificacion de contraseña esta oculta

    const isHidden = passwordInput.type==='password';

    // cambiar de password a texto

    passwordInput.type=isHidden ? 'text':'password';

    // alteracion del ojo para ver o no la contraseña
    eyeOpen.classList.toggle('hidden', !isHidden);
    eyeClosed.classList.toggle('hidden', isHidden);
}
)