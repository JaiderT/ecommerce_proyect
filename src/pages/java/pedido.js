// pedido.js - TechStore Pro
const API_URL = "https://ecommerce-proyect-kul6.onrender.com/api";
const getCarrito = () => JSON.parse(localStorage.getItem('carrito')) || [];
const setCarrito = (c) => localStorage.setItem('carrito', JSON.stringify(c));

// Toast
function toast(msg, tipo = 'success') {
    const color = tipo === 'success' ? 'bg-green-600' : 'bg-red-600';
    const div = document.createElement('div');
    div.className = `fixed top-20 right-5 ${color} text-white px-6 py-4 rounded-xl shadow-2xl z-50 transition-all duration-500`;
    div.style.cssText = 'opacity:0;transform:translateX(400px)';
    div.innerHTML = `<div class="flex items-center gap-3"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg><span class="font-semibold">${msg}</span></div>`;
    document.body.appendChild(div);
    setTimeout(() => div.style.cssText = 'opacity:1;transform:translateX(0)', 10);
    setTimeout(() => {
        div.style.cssText = 'opacity:0;transform:translateX(400px)';
        setTimeout(() => div.remove(), 500);
    }, 3000);
}

// Cargar carrito
function cargarCarrito() {
    const carrito = getCarrito();
    if (!carrito.length) return;
    
    const subtitulo = document.querySelector('h1 + p');
    if (!subtitulo) return;
    
    subtitulo.insertAdjacentHTML('afterend', `<div class="mt-8">${carrito.map((item, i) => `
        <div class="bg-white shadow-lg rounded-xl p-5 mb-4 flex items-center gap-4">
            <img src="${item.image}" alt="${item.nombre}" class="w-24 h-24 object-cover rounded-lg">
            <div class="flex-1">
                <h3 class="font-semibold text-lg">${item.nombre}</h3>
                <p class="text-gray-500 text-sm">${item.descripcion || ''}</p>
                <p class="text-blue-600 font-bold mt-1">$${item.precio.toLocaleString('es-CO')}</p>
            </div>
            <div class="flex items-center gap-3">
                <button onclick="cambiarCantidad(${i},-1)" class="bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300 font-bold">-</button>
                <span class="font-semibold text-lg w-8 text-center">${item.cantidad}</span>
                <button onclick="cambiarCantidad(${i},1)" class="bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300 font-bold">+</button>
            </div>
            <button onclick="eliminarProducto(${i})" class="text-red-500 hover:text-red-700 p-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
        </div>
    `).join('')}</div>`);
    
    actualizarResumen(carrito);
    ocultarPreciosExtras();
}

// Ocultar precios extras
function ocultarPreciosExtras() {
    const resumen = document.querySelector('.w-\\[380px\\]');
    if (!resumen) return;
    
    const precioArriba = resumen.querySelector('h2')?.previousElementSibling;
    if (precioArriba && precioArriba.textContent.includes('$')) {
        precioArriba.style.display = 'none';
    }
    
    const infoEnvio = Array.from(resumen.querySelectorAll('h3')).find(h => h.textContent.includes('Información'));
    if (infoEnvio) {
        const precioInfo = infoEnvio.previousElementSibling;
        if (precioInfo && precioInfo.textContent.includes('$')) {
            precioInfo.style.display = 'none';
        }
    }
}

// Cambiar cantidad
function cambiarCantidad(i, cambio) {
    const carrito = getCarrito();
    carrito[i].cantidad += cambio;
    if (carrito[i].cantidad <= 0) carrito.splice(i, 1);
    setCarrito(carrito);
    location.reload();
}

// Eliminar
function eliminarProducto(i) {
    const carrito = getCarrito();
    carrito.splice(i, 1);
    setCarrito(carrito);
    toast('Producto eliminado', 'success');
    location.reload();
}

// Actualizar resumen
function actualizarResumen(carrito) {
    const subtotal = carrito.reduce((s, item) => s + (item.precio * item.cantidad), 0);
    const envio = subtotal > 100000 ? 0 : 5000;
    const total = subtotal + envio;
    
    const resumen = document.querySelector('.w-\\[380px\\]');
    if (!resumen) return;
    
    resumen.querySelectorAll('span').forEach(span => {
        const prev = span.previousElementSibling?.textContent || '';
        
        if (span.textContent === '$0' && prev.includes('Subtotal')) {
            span.textContent = `$${subtotal.toLocaleString('es-CO')}`;
        }
        
        if (span.classList.contains('text-blue-600') && span.parentElement?.classList.contains('bg-gray-100')) {
            span.textContent = `$${total.toLocaleString('es-CO')}`;
        }
        
        if (span.textContent === 'Gratis' && prev.includes('Envío')) {
            span.textContent = envio === 0 ? 'Gratis' : `$${envio.toLocaleString('es-CO')}`;
        }
    });
}

// Finalizar compra
async function finalizarCompra() {
    const carrito = getCarrito();
    if (!carrito.length) return toast('Tu carrito está vacío', 'error');
    
    // Buscar inputs dentro del resumen (no en los productos)
    const resumen = document.querySelector('.w-\\[380px\\]');
    const inputs = resumen.querySelectorAll('input');
    
    const direccion = inputs[0]?.value.trim() || '';
    const ciudad = inputs[1]?.value.trim() || '';
    const codigoPostal = inputs[2]?.value.trim() || '';
    const metodoPago = resumen.querySelector('select')?.value || 'Efectivo contra entrega';
    
    console.log('Datos capturados:', { direccion, ciudad, codigoPostal, metodoPago });
    
    if (!direccion || !ciudad || !codigoPostal) {
        return toast('Completa todos los campos', 'error');
    }
    
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Finalizar'));
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Procesando...';
    }
    
    try {
        const subtotal = carrito.reduce((s, i) => s + (i.precio * i.cantidad), 0);
        const res = await fetch(`${API_URL}/pedido`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pedidoId: `PED-${Date.now()}`,
                email: JSON.parse(localStorage.getItem('usuario') || '{}').email || 'invitado@techstore.com',
                direccion: `${direccion}, ${ciudad}, ${codigoPostal}`,
                nombre_productos: carrito.map(i => i.nombre),
                cantida_producto: carrito.reduce((s, i) => s + i.cantidad, 0),
                metodo_pago: metodoPago,
                fecha_pedido: new Date(),
                estado: 'pendiente',
                total: subtotal + (subtotal > 100000 ? 0 : 5000)
            })
        });
        
        if (res.ok) {
            toast('¡Pedido realizado con éxito!', 'success');
            localStorage.removeItem('carrito');
            setTimeout(() => window.location.href = './productos.html', 2000);
        } else throw new Error();
    } catch {
        toast('Error al procesar el pedido', 'error');
        if (btn) {
            btn.disabled = false;
            btn.textContent = '✓ Finalizar Compra';
        }
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    cargarCarrito();
    setTimeout(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Finalizar'));
        if (btn) btn.addEventListener('click', finalizarCompra);
    }, 500);
});