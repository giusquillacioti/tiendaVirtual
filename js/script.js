
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
        Swal.fire('Debes ingresar algún valor para poder cambiar el título de la tienda.')
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

const productos = JSON.parse(localStorage.getItem('productos')) || [],
    btnNuevo = document.getElementById('btnNuevo'),
    display = document.querySelector('.display'),
    nombre = document.getElementById('nombre'),
    imagen = document.getElementById('imagen'),
    precio = document.getElementById('precio'),
    stock = document.getElementById('stock');

function Producto(nombre, imagen, precio, stock) {
    this.id = parseInt(Math.random() * 10000).toString();
    this.nombre = nombre;
    this.imagen = imagen;
    this.precio = precio;
    this.stock = stock;
}

//AGREGAR PRODUCTO

function agregarProducto(nombre, imagen, precio, stock) {
    const producto = new Producto(nombre, imagen, precio, stock);
    productos.unshift(producto);

    localStorage.setItem('productos', JSON.stringify(productos));
}

// BORRAR PRODUCTO

function borrarProducto(objectId) {
    const productoIndex = productos.findIndex(producto => producto.id === objectId)
    productos.splice(productoIndex,1);
    localStorage.setItem('productos', JSON.stringify(productos));
}

//CREAR TARJETA

function crearTarjeta() {
    display.innerHTML = '';

    display.classList.add('displayGrid');

    let productosGuardados = JSON.parse(localStorage.getItem('productos'));

    productosGuardados.forEach(producto => {
        if (producto.stock == 0 || producto.stock == null) {
            display.innerHTML += `<div class="card" id="${producto.id}">
                <h3>${producto.nombre}</h3>
                <img src="http://drive.google.com/uc?export=view&id=${producto.imagen}" alt="${producto.nombre}" width="200" height="200">
                <h4>$ ${producto.precio}</h4>
                <h4>SIN STOCK</h4>
            <div class="cardBtns userView">
                <button class="btn btnModificar">Modificar</button>
                <button class="btn btnEliminar">Eliminar</button>
            </div>
            </div>`
        } else if (producto.stock <= 5) {
            display.innerHTML += `<div class="card" id="${producto.id}">
                <h3>${producto.nombre}</h3>
                <img src="http://drive.google.com/uc?export=view&id=${producto.imagen}" alt="${producto.nombre}" width="200" height="200">
                <h4>$ ${producto.precio}</h4>
                <h4>¡Quedan ${producto.stock} disponibles!</h4>
            <div class="cardBtns userView">
                <button class="btn btnModificar">Modificar</button>
                <button class="btn btnEliminar">Eliminar</button>
            </div>
            <button class="btn userView dNone">Agregar al carrito</button>
            </div>`
        } else {
            display.innerHTML += `<div class="card" id="${producto.id}">
                <h3>${producto.nombre}</h3>
                <img src="http://drive.google.com/uc?export=view&id=${producto.imagen}" alt="${producto.nombre}" width="200" height="200">
                <h4>$ ${producto.precio}</h4>
            <div class="cardBtns userView">
                <button class="btn btnModificar">Modificar</button>
                <button class="btn btnEliminar">Eliminar</button>
            </div>
            <button class="btn userView dNone">Agregar al carrito</button>
            </div>`
        };
    })

    //BORRAR PRODUCTO
    
    const btnsEliminar = document.getElementsByClassName('btnEliminar');
    for (const btn of btnsEliminar) {
        btn.addEventListener('click', (e) => {
            Swal.fire({
                title: '¿Estás seguro de que deseas eliminar este producto?',
                showDenyButton: true,
                confirmButtonText: 'Eliminar',
                denyButtonText: `Cancelar`,
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title:'El producto ha sido eliminado',
                        icon:'success',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    borrarProducto(e.target.parentNode.parentNode.id);
                    crearTarjeta();
                };
            })
        })
    }

}

//----------

/* Swal.fire({
    title: '¿Estás seguro de que deseas borrar este producto?',
    showDenyButton: true,
    confirmButtonText: 'Borrar',
    denyButtonText: `Cancelar`,
}).then((result) => {
    if (result.isConfirmed) {
        Swal.fire('El producto ha sido eliminado', '', 'success')
    };
}) */

//----------

btnNuevo.addEventListener('click', () => {
    agregarProducto(nombre.value, imagen.value, precio.value, stock.value);
    crearTarjeta();
});

if (JSON.parse(localStorage.getItem('productos')) != null) {
    crearTarjeta();
}

if(display.innerHTML == ''){
    display.classList.remove('displayGrid');
    display.innerHTML = '<h3 class="noProducts">En este momento no hay productos cargados a la tienda.</h3>';
}





// VISTA PREVIA

const vistaPrevia = document.getElementById('vistaPrevia');

function borrar() {
    let userView = document.querySelectorAll('.userView');

    for (let x of userView) {
        x.classList.toggle('dNone');
    }
}

function cambiarBoton() {
    vistaPrevia.innerText === 'Vista previa' ? vistaPrevia.innerText = 'Volver' : vistaPrevia.innerText = 'Vista previa';
}

vistaPrevia.addEventListener('click', () => {
    borrar();
    cambiarBoton();
});





