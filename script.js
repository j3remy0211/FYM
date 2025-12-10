// --- DATOS INICIALES (Del PDF) ---
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

// Variable global de productos
let productos = [];

// --- INICIALIZACIÓN ---
window.onload = function() {
    cargarDatos();
    renderizarLista(productos);
};

function cargarDatos() {
    const guardado = localStorage.getItem('fym_inventario_v1');
    if (guardado) {
        productos = JSON.parse(guardado);
    } else {
        productos = datosIniciales;
        guardarEnLocal();
    }
}

function guardarEnLocal() {
    localStorage.setItem('fym_inventario_v1', JSON.stringify(productos));
}

// --- RENDERIZADO (DIBUJAR EN PANTALLA) ---
function renderizarLista(lista) {
    const contenedor = document.getElementById('lista-productos');
    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = "<p style='text-align:center; padding:20px;'>No se encontraron productos.</p>";
        return;
    }

    lista.forEach(prod => {
        const div = document.createElement('div');
        // Clase para alerta de stock bajo
        const claseAlerta = prod.stock <= 5 ? "poca-existencia" : "";
        div.className = `card ${claseAlerta}`;
        
        div.innerHTML = `
            <div class="producto-header">
                <h3 class="nombre-prod">${prod.nombre}</h3>
                <span class="precio-prod">C$ ${parseFloat(prod.precio).toFixed(2)}</span>
            </div>
            <div class="info-row">
                <span class="stock-info">Stock: <strong>${prod.stock}</strong></span>
                <button class="btn-vender" onclick="venderProducto(${prod.id})" ${prod.stock <= 0 ? 'disabled' : ''}>
                    ${prod.stock > 0 ? 'VENDER 1' : 'AGOTADO'}
                </button>
            </div>
        `;
        contenedor.appendChild(div);
    });
}

// --- LÓGICA DEL NEGOCIO ---

function filtrarProductos() {
    const texto = document.getElementById('buscador').value.toLowerCase();
    const filtrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(texto)
    );
    renderizarLista(filtrados);
}

function venderProducto(id) {
    const index = productos.findIndex(p => p.id === id);
    if (index !== -1 && productos[index].stock > 0) {
        productos[index].stock -= 1;
        guardarEnLocal();
        // Volver a filtrar para no perder la búsqueda actual
        filtrarProductos(); 
    }
}

function agregarProducto() {
    const nombre = document.getElementById('nuevo-nombre').value;
    const precio = parseFloat(document.getElementById('nuevo-precio').value);
    const stock = parseInt(document.getElementById('nuevo-stock').value);

    if (nombre && precio && stock) {
        const nuevoId = Date.now(); // ID único basado en la hora
        productos.push({ id: nuevoId, nombre, precio, stock });
        guardarEnLocal();
        alert("¡Producto agregado!");
        
        // Limpiar formulario
        document.getElementById('nuevo-nombre').value = "";
        document.getElementById('nuevo-precio').value = "";
        document.getElementById('nuevo-stock').value = "";
    } else {
        alert("Por favor llena todos los datos.");
    }
}

// --- UTILIDADES ---
function mostrarPestana(id) {
    document.querySelectorAll('.content').forEach(div => div.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(id).classList.add('active');
    // Activar botón visualmente
    event.target.classList.add('active');
    
    if(id === 'vender') filtrarProductos(); // Refrescar lista al volver
}

function reiniciarFabrica() {
    if(confirm("¿Estás seguro? Se borrarán todos los cambios y ventas.")) {
        localStorage.removeItem('fym_inventario_v1');
        location.reload();
    }
}

function descargarRespaldo() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(productos));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "inventario_f&m.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// --- FUNCIÓN PARA DESCARGAR PDF ---
async function descargarPDF() {
    // Verificar si la librería cargó correctamente
    if (!window.jspdf) {
        alert("Error: No se cargó la librería de PDF. Revisa tu conexión a internet.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // 1. Título y Fecha
    doc.setFontSize(18);
    doc.text("Inventario F&M", 14, 20);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    const fecha = new Date().toLocaleDateString('es-NI', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    doc.text("Generado el: " + fecha, 14, 28);

    // 2. Preparar los datos para la tabla
    // Convertimos el array de objetos a un array de arrays (filas)
    const columnas = ["Producto", "Precio (C$)", "Stock"];
    const filas = productos.map(p => [
        p.nombre,
        p.precio.toFixed(2),
        p.stock
    ]);

    // 3. Generar la tabla usando autoTable
    doc.autoTable({
        head: [columnas],
        body: filas,
        startY: 35, // Empezar debajo del título
        theme: 'grid', // Estilo de rejilla
        headStyles: { fillColor: [44, 62, 80] }, // Color del encabezado (mismo azul que la app)
        styles: { fontSize: 10 },
        columnStyles: {
            0: { cellWidth: 'auto' }, // Nombre ancho auto
            1: { halign: 'right' },   // Precio alineado derecha
            2: { halign: 'center' }   // Stock centrado
        }
    });

    // 4. Guardar archivo
    doc.save(`Inventario_FyM_${new Date().toISOString().slice(0,10)}.pdf`);
}