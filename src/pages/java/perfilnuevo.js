document.addEventListener("DOMContentLoaded", async () => {
    const sesionActiva = localStorage.getItem("sesionActiva");
    const contenedor = document.getElementById("user-menu-container");

    if (!contenedor || !sesionActiva) return;

    const perfil = JSON.parse(localStorage.getItem("usuario"));
    if (!perfil || !perfil.email) return;

    let usuario = null;

    // Obtener perfil
    try {
        const res = await fetch("https://ecommerce-proyect-kul6.onrender.com/api/perfil/obtener", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: perfil.email })
        });
        const data = await res.json();
        if (!res.ok) throw new Error("No se pudo obtener perfil");
        usuario = data.usuario;
    } catch (err) {
        console.error("Error al obtener el perfil", err);
        localStorage.clear();
        window.location.href = "../pages/login.html";
        return;
    }

    // Mostrar datos
    document.getElementById("display-name").textContent = usuario.nombre;
    document.getElementById("display-email").textContent = usuario.email;
    document.getElementById("nombre").value = usuario.nombre;
    document.getElementById("telefono").value = usuario.telefono;
    document.getElementById("email").value = usuario.email;

    // Avatar
    contenedor.innerHTML = `
        <div class="w-20 h-20 rounded-full bg-linear-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-3xl shadow-lg">
            ${usuario.nombre[0].toUpperCase()}
        </div>
    `;

    let datosOriginales = { nombre: usuario.nombre, telefono: usuario.telefono };
    const inputs = [document.getElementById("nombre"), document.getElementById("telefono")];
    const btns = {
        editar: document.getElementById("btn-editar"),
        guardar: document.getElementById("btn-guardar"),
        cancelar: document.getElementById("btn-cancelar"),
        group: document.getElementById("btn-group-edit")
    };

    const toggleEdit = (habilitar) => {
        inputs.forEach(input => {
            input.disabled = !habilitar;
            input.classList.toggle("bg-gray-100", !habilitar);
            input.classList.toggle("cursor-not-allowed", !habilitar);
            input.classList.toggle("bg-white", habilitar);
        });
        btns.editar.classList.toggle("hidden", habilitar);
        btns.group.classList.toggle("hidden", !habilitar);
        btns.group.classList.toggle("flex", habilitar);
    };

    // Editar
    btns.editar.addEventListener("click", () => toggleEdit(true));

    // Cancelar
    btns.cancelar.addEventListener("click", () => {
        inputs[0].value = datosOriginales.nombre;
        inputs[1].value = datosOriginales.telefono;
        toggleEdit(false);
    });

    // Función para mostrar toast
    const mostrarToast = (mensaje, tipo = "success") => {
        const toast = document.createElement("div");
        toast.className = `fixed top-20 right-4 px-6 py-4 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 z-50 ${
            tipo === "success" ? "bg-green-500" : tipo === "error" ? "bg-red-500" : "bg-blue-500"
        }`;
        toast.textContent = mensaje;
        document.body.appendChild(toast);

        setTimeout(() => toast.remove(), 3000);
    };

    // Guardar
    btns.guardar.addEventListener("click", async () => {
        const nombre = inputs[0].value.trim();
        const telefono = inputs[1].value.trim();

        if (!nombre || !telefono) {
            mostrarToast("Por favor completa todos los campos", "error");
            return;
        }
        if (!confirm("¿Guardar cambios?")) return;

        try {
            const res = await fetch("https://ecommerce-proyect-kul6.onrender.com/api/perfil/actualizar", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: perfil.email, nombre, telefono })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Error al actualizar");

            datosOriginales = { nombre, telefono };
            document.getElementById("display-name").textContent = nombre;

            const usuarioActualizado = JSON.parse(localStorage.getItem("usuario"));
            usuarioActualizado.nombre = nombre;
            usuarioActualizado.telefono = telefono;
            localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));

            mostrarToast("Perfil actualizado exitosamente", "success");
            toggleEdit(false);

        } catch (err) {
            console.error("Error:", err);
            mostrarToast("Error al actualizar: " + err.message, "error");
        }
    });
});