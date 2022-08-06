
//TÍTULO

const titulo = document.getElementById('titulo'),
    tituloPagina = document.getElementById('tituloPagina'),
    inputTitulo = document.getElementById('inputTitulo'),
    btnTitulo = document.getElementById('btnTitulo'),
    btnResetTitulo = document.getElementById('btnResetTitulo');

function cambiarTitulo() {
    const nuevoTitulo = inputTitulo.value,
        nuevoTituloPagina = `${inputTitulo.value} | Tienda Virtual`;
    
    if (nuevoTitulo == '') {
        alert('Debes ingresar algún valor para poder cambiar el título de la tienda.');
    } else {
        titulo.innerText = nuevoTitulo;
        tituloPagina.innerText = `${nuevoTituloPagina}`;
        
        localStorage.setItem('nuevoTitulo', nuevoTitulo);
        localStorage.setItem('nuevoTituloPagina', `${nuevoTituloPagina}`);
    }
}

btnTitulo.addEventListener('click', cambiarTitulo);

function resetearTitulo() {
    titulo.innerText = 'Mi Tienda Virtual';
    tituloPagina.innerText = 'Tienda Virtual';

    localStorage.removeItem('nuevoTitulo');
    localStorage.removeItem('nuevoTituloPagina');
}

btnResetTitulo.addEventListener('click', resetearTitulo)

if (localStorage.getItem('nuevoTitulo') != null) {
    titulo.innerText = localStorage.getItem('nuevoTitulo');
    tituloPagina.innerText = localStorage.getItem('nuevoTituloPagina');
}


//PRODUCTOS

const productos = [],
    btnNuevo = document.getElementById('btnNuevo'),
    display = document.querySelector('.display'),
    nombre = document.getElementById('nombre'),
    imagen = document.getElementById('imagen'),
    precio = document.getElementById('precio'),
    stock = document.getElementById('stock'),
    main = document.querySelector('main');

function Producto(nombre, imagen, precio, stock) {
    this.id = parseInt(Math.random() * 10000).toString();
    this.nombre = nombre;
    this.imagen = imagen;
    this.precio = precio;
    this.stock = stock;
}

function agregarProducto(nombre, imagen, precio, stock) {
    const producto = new Producto(nombre, imagen, precio, stock);
    productos.unshift(producto);
}

function crearTarjeta() {
    display.innerHTML = '';
    productos.forEach(producto => {
        if (producto.stock == 0 || producto.stock == null) {
            display.innerHTML += `<div class="card" id="${producto.id}">
            <h3>${producto.nombre}</h3>
            <img src="http://drive.google.com/uc?export=view&id=${producto.imagen}" alt="${producto.nombre}" width="200" height="200">
            <h4>$ ${producto.precio}</h4>
            <h4>SIN STOCK</h4>
        </div>`
        } else if (producto.stock <= 5) {
            display.innerHTML += `<div class="card" id="${producto.id}">
            <h3>${producto.nombre}</h3>
            <img src="http://drive.google.com/uc?export=view&id=${producto.imagen}" alt="${producto.nombre}" width="200" height="200">
            <h4>$ ${producto.precio}</h4>
            <h4>¡Quedan ${producto.stock} disponibles!</h4>
            </div>`
        } else {
            display.innerHTML += `<div class="card" id="${producto.id}">
            <h3>${producto.nombre}</h3>
            <img src="http://drive.google.com/uc?export=view&id=${producto.imagen}" alt="${producto.nombre}" width="200" height="200">
            <h4>$ ${producto.precio}</h4>
            </div>`
        };
    })
}

btnNuevo.addEventListener('click', () => {
    agregarProducto(nombre.value, imagen.value, precio.value, stock.value);
    crearTarjeta();
});


