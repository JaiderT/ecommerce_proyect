document.getElementById("recuperar-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const API_URL = "https://ecommerce-proyect-kul6.onrender.com/api/Recuperar/solicitar-codigo";

    const email = document.getElementById("email").value.trim();
    const errorEmail = document.getElementById("email-error");
    const btn = document.getElementById('recupera-btn');

    // limpiar mensaje
    errorEmail.classList.add("hidden");

    btn.disabled = true;
    btn.textContent = 'Enviando Codigo...';

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
            errorEmail.textContent = data.message || "Error en la solicitud";
            errorEmail.classList.remove("hidden");
            return;
        }

        // Guardamos el email para usarlo en nuevapassword
        localStorage.setItem("email", email);

        // REDIRIGIR A nueva contraseña
        setTimeout(() => window.location.href = 'nueva_password.html', 2000);

    } catch (error) {
        console.error("Error:", error);
        errorEmail.textContent = "Error de servidor";
        errorEmail.classList.remove("hidden");
    }
});