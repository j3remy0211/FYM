// --- DATOS INICIALES (Misma lista que antes, resumida para el ejemplo) ---
// NOTA: Si ya usaste la app, los datos reales están en tu localStorage, no aquí.
const datosIniciales = [
    { id: 1, nombre: "Acetominofén TB 500mg (20 Tab)", precio: 54.00, stock: 20 },
    { id: 2, nombre: "Acetominofén 500mg THEON (100 Tab)", precio: 82.80, stock: 10 },
    { id: 3, nombre: "Alcohol Líquido Pequeño", precio: 8.40, stock: 15 },
    { id: 4, nombre: "Alka AD (Bayer) 12 tabletas", precio: 420.00, stock: 5 },
    { id: 5, nombre: "Alka Seltzer (Bayer) 50 Tab", precio: 366.00, stock: 5 },
    { id: 6, nombre: "Alka Gastric (36 Tab) Bayer", precio: 157.80, stock: 5 },
    { id: 7, nombre: "Alprazolan (100 Tab) S.C", precio: 720.00, stock: 2 },
    { id: 8, nombre: "Actimicina Bronquial (18 Sobres)", precio: 150.00, stock: 10 },
    { id: 9, nombre: "Amoxicilina 500mg (100 unid)", precio: 144.00, stock: 8 },
    { id: 10, nombre: "Alive (Bayer) 6 Blister", precio: 282.00, stock: 5 },
    { id: 11, nombre: "Calamina Loción", precio: 60.00, stock: 5 },
    { id: 12, nombre: "Condones Clásico (Durex) 3 Unid", precio: 63.60, stock: 20 },
    { id: 13, nombre: "Curita Económica Bangli (100)", precio: 36.00, stock: 10 },
    { id: 14, nombre: "Doloneurobión", precio: 660.00, stock: 5 },
    { id: 15, nombre: "Diclofenac Gel 30gr", precio: 30.00, stock: 10 },
    { id: 16, nombre: "Foskrol Forte Ginseng (30 Caps)", precio: 163.20, stock: 5 },
    { id: 17, nombre: "Ibuprofeno 400mg (100 Caps)", precio: 288.00, stock: 5 },
    { id: 18, nombre: "Lansoprazol 30mg (30 Caps)", precio: 52.80, stock: 10 },
    { id: 19, nombre: "Loratadina 10mg", precio: 84.00, stock: 10 },
    { id: 20, nombre: "Neuro Fortan (60 Caps)", precio: 156.00, stock: 5 },
    { id: 21, nombre: "Omeprazol 20mg (100 Caps)", precio: 145.20, stock: 10 },
    { id: 22, nombre: "Panadol Antigripal 100 caps", precio: 540.00, stock: 5 },
    { id: 23, nombre: "Suero Oral (Sobres)", precio: 318.00, stock: 10 },
    { id: 24, nombre: "Tabcín Día Gel (60 Caps)", precio: 540.00, stock: 5 },
    { id: 25, nombre: "Vick Pomo 50g", precio: 66.00, stock: 10 },
    { id: 26, nombre: "Viro Grip Día Gel (24 Sobres)", precio: 288.00, stock: 5 },
    { id: 27, nombre: "Viro Grip Noche Gel (24 Sobres)", precio: 288.00, stock: 5 },
    { id: 28, nombre: "Zorritone Caramelo", precio: 96.00, stock: 20 }
];

let productos = [];

window.onload = function() {
    cargarDatos();
    mostrarPestana('vender'); // Iniciar en vender
};

function cargarDatos() {
    const guardado = localStorage.getItem('fym_inventario_v3');
    if (guardado) {
        productos = JSON.parse(guardado);
    } else {
        productos = datosIniciales;
        guardarEnLocal();
    }
}

function guardarEnLocal() {
    localStorage.setItem('fym_inventario_v3', JSON.stringify(productos));
}

// --- PESTAÑAS ---
function mostrarPestana(id) {
    document.querySelectorAll('.content').forEach(div => div.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(id).classList.add('active');
    
    // Activar visualmente el botón correcto
    const btnIndex = id === 'vender' ? 0 : 1;
    document.querySelectorAll('.tab-btn')[btnIndex].classList.add('active');

    if(id === 'vender') filtrarVentas();
    if(id === 'admin') filtrarInventario();
}

// --- PESTAÑA 1: VENDER (SOLO BOTÓN DE VENTA) ---
function filtrarVentas() {
    const texto = document.getElementById('buscador').value.toLowerCase();
    const lista = productos.filter(p => p.nombre.toLowerCase().includes(texto));
    renderizarVentas(lista);
}

function renderizarVentas(lista) {
    const contenedor = document.getElementById('lista-ventas');
    contenedor.innerHTML = "";

    lista.forEach(prod => {
        const div = document.createElement('div');
        div.className = `card ${prod.stock <= 5 ? "poca-existencia" : ""}`;
        div.innerHTML = `
            <div class="producto-header">
                <h3 class="nombre-prod">${prod.nombre}</h3>
                <span class="precio-prod">C$ ${parseFloat(prod.precio).toFixed(2)}</span>
            </div>
            <div class="info-row">
                <span style="font-size:1.2rem">Stock: <strong>${prod.stock}</strong></span>
                <button class="btn-vender" onclick="vender(${prod.id})" ${prod.stock <= 0 ? 'disabled' : ''}>
                    ${prod.stock > 0 ? 'VENDER 1' : 'AGOTADO'}
                </button>
            </div>
        `;
        contenedor.appendChild(div);
    });
}

function vender(id) {
    const index = productos.findIndex(p => p.id === id);
    if (productos[index].stock > 0) {
        productos[index].stock--;
        guardarEnLocal();
        filtrarVentas(); // Refrescar vista
    }
}

// --- PESTAÑA 2: INVENTARIO (EDICIÓN Y CORRECCIÓN) ---
function filtrarInventario() {
    const texto = document.getElementById('buscador-admin').value.toLowerCase();
    const lista = productos.filter(p => p.nombre.toLowerCase().includes(texto));
    renderizarInventario(lista);
}

function renderizarInventario(lista) {
    const contenedor = document.getElementById('lista-inventario');
    contenedor.innerHTML = "";

    lista.forEach(prod => {
        const div = document.createElement('div');
        div.className = "card";
        // Aquí agregamos los controles de + y - y el botón Editar
        div.innerHTML = `
            <div class="producto-header">
                <h3 class="nombre-prod">${prod.nombre}</h3>
                <button class="btn-editar" onclick="abrirModalEditar(${prod.id})">✏️ Editar</button>
            </div>
            <div style="text-align:right; color:#27ae60; font-weight:bold; margin-bottom:10px;">
                Precio Actual: C$ ${prod.precio.toFixed(2)}
            </div>
            
            <div class="admin-controls">
                <button class="stock-control-btn btn-menos" onclick="ajustarStock(${prod.id}, -1)">-</button>
                <span class="stock-display">${prod.stock}</span>
                <button class="stock-control-btn btn-mas" onclick="ajustarStock(${prod.id}, 1)">+</button>
            </div>
            <p style="text-align:center; font-size:0.9rem; color:#777; margin-top:5px;">
                Usa + y - para corregir cantidades
            </p>
        `;
        contenedor.appendChild(div);
    });
}

// Función mágica para corregir errores (+1 o -1)
function ajustarStock(id, cantidad) {
    const index = productos.findIndex(p => p.id === id);
    if (index !== -1) {
        const nuevoStock = productos[index].stock + cantidad;
        if (nuevoStock >= 0) {
            productos[index].stock = nuevoStock;
            guardarEnLocal();
            filtrarInventario(); // Refrescar solo esta vista
        }
    }
}

// --- MODALES (VENTANAS EMERGENTES) ---

// 1. Modal Nuevo Producto
function mostrarFormularioNuevo() {
    document.getElementById('modal-nuevo').style.display = "block";
}
function cerrarModalNuevo() {
    document.getElementById('modal-nuevo').style.display = "none";
}
function agregarProducto() {
    const nombre = document.getElementById('nuevo-nombre').value;
    const precio = parseFloat(document.getElementById('nuevo-precio').value);
    const stock = parseInt(document.getElementById('nuevo-stock').value);

    if (nombre && precio >= 0 && stock >= 0) {
        productos.push({ id: Date.now(), nombre, precio, stock });
        guardarEnLocal();
        cerrarModalNuevo();
        filtrarInventario();
        alert("¡Producto agregado!");
        // Limpiar
        document.getElementById('nuevo-nombre').value = "";
        document.getElementById('nuevo-precio').value = "";
        document.getElementById('nuevo-stock').value = "";
    } else {
        alert("Revisa los datos por favor.");
    }
}

// 2. Modal Editar Producto Existente
function abrirModalEditar(id) {
    const prod = productos.find(p => p.id === id);
    if (prod) {
        document.getElementById('edit-id').value = id;
        document.getElementById('edit-nombre').value = prod.nombre;
        document.getElementById('edit-precio').value = prod.precio;
        document.getElementById('modal-editar').style.display = "block";
    }
}
function cerrarModal() {
    document.getElementById('modal-editar').style.display = "none";
}

function guardarEdicion() {
    const id = parseInt(document.getElementById('edit-id').value);
    const nuevoNombre = document.getElementById('edit-nombre').value;
    const nuevoPrecio = parseFloat(document.getElementById('edit-precio').value);

    const index = productos.findIndex(p => p.id === id);
    if (index !== -1 && nuevoNombre && nuevoPrecio >= 0) {
        productos[index].nombre = nuevoNombre;
        productos[index].precio = nuevoPrecio;
        guardarEnLocal();
        cerrarModal();
        filtrarInventario(); // Actualizar la lista
    } else {
        alert("Datos inválidos");
    }
}

// --- PDF Y UTILIDADES ---
async function descargarPDF() {
    if (!window.jspdf) { alert("Conecta a internet para generar el PDF"); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Inventario Farmacia F&M", 14, 20);
    doc.text("Fecha: " + new Date().toLocaleDateString(), 14, 28);
    
    const filas = productos.map(p => [p.nombre, p.precio.toFixed(2), p.stock]);
    doc.autoTable({
        head: [["Producto", "Precio", "Stock"]],
        body: filas,
        startY: 35,
    });
    doc.save("Inventario.pdf");
}

function descargarRespaldo() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(productos));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = "respaldo_farmacia.json";
    a.click();
}

function reiniciarFabrica() {
    if(confirm("¿SEGURO? Se borrará todo.")) {
        localStorage.removeItem('fym_inventario_v3');
        location.reload();
    }
}

// Cerrar modales si tocan fuera
window.onclick = function(event) {
    if (event.target == document.getElementById('modal-editar')) cerrarModal();
    if (event.target == document.getElementById('modal-nuevo')) cerrarModalNuevo();
}