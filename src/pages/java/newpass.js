// Validar que se haya solicitado un código antes
const email = localStorage.getItem("email");

if (!email) {
    // Si el usuario intenta abrir nuevapassword.html directamente → lo mandamos a recuperar
    window.location.href = "./recuperar.html";
}

    const API_URL = "https://ecommerce-proyect-kul6.onrender.com/api/Recuperar/cambiar-password";

document.getElementById("newpass-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const codigo = document.getElementById("code").value.trim();
    const nuevapassword = document.getElementById("new_pass").value.trim();
    const confirmarPassword = document.getElementById("confirm_pass").value.trim();
    const btn = document.getElementById('newpass-btn');

    const codeError = document.getElementById("code-error");
    const passError = document.getElementById("pass-error");
    const confirmError = document.getElementById("confirm-error");

    codeError.classList.add("hidden");
    passError.classList.add("hidden");
    confirmError.classList.add("hidden");

    if (nuevapassword !== confirmarPassword) {
        confirmError.textContent = "Las contraseñas no coinciden";
        confirmError.classList.remove("hidden");
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Actualizando Contraseña...';

    try {
        const response = await fetch (API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                codigo,
                nuevapassword
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            codeError.textContent = data.message || "Código incorrecto";
            codeError.classList.remove("hidden");
            return;
        }

        // Limpiar datos
        localStorage.removeItem("email");

        // Redirigir al login
        window.location.href = "./login.html";

    } catch (error) {
        console.error("Error:", error);
        codeError.textContent = "Error de servidor";
        codeError.classList.remove("hidden");
    }
});