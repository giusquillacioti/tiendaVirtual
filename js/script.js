
// TÍTULO

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















// ----------- PRODUCTOS -----------

const productos = JSON.parse(localStorage.getItem('productos')) || [],
    btnNuevo = document.getElementById('btnNuevo'),
    display = document.querySelector('.display'),
    nombre = document.getElementById('nombre'),
    imagen = document.getElementById('imagen'),
    precio = document.getElementById('precio'),
    stock = document.getElementById('stock');


// FUNCIÓN CONSTRUCTORA

function Producto(nombre, imagen, precio, stock) {
    this.id = parseInt(Math.random() * 10000).toString();
    this.nombre = nombre;
    this.imagen = imagen;
    this.precio = precio;
    this.stock = stock;
}

// AGREGAR PRODUCTO

function agregarProducto(nombre, imagen, precio, stock) {
    const producto = new Producto(nombre, imagen, precio, stock);
    productos.unshift(producto);

    localStorage.setItem('productos', JSON.stringify(productos));
}

// BORRAR PRODUCTO

function borrarProducto(objectId) {
    const productoIndex = productos.findIndex(producto => producto.id === objectId)
    productos.splice(productoIndex, 1);
    localStorage.setItem('productos', JSON.stringify(productos));
}

// MODIFICAR PRODUCTO

function modificarProducto(objectId, nuevoNombre, nuevaImagen, nuevoPrecio, nuevoStock) {
    const productoIndex = productos.findIndex(producto => producto.id === objectId)
    productos[productoIndex].nombre = nuevoNombre;
    productos[productoIndex].imagen = nuevaImagen;
    productos[productoIndex].precio = nuevoPrecio;
    productos[productoIndex].stock = nuevoStock;
    localStorage.setItem('productos', JSON.stringify(productos));
}

//MODIFICAR TARJETA

function inputsModificar(tarjetaId) {
    const tarjetadeProducto = document.getElementById(tarjetaId);
    const productoEncontrado = productos.find(producto => producto.id === tarjetaId);
    tarjetadeProducto.innerHTML = `
        <label for="nombre">Nombre</label>
        <input type="text" name="nombre" id="nuevoNombre" value="${productoEncontrado.nombre}">
        <label for="imagen">Imagen</label>
        <input type="url" name="imagen" id="nuevaImagen" value="${productoEncontrado.imagen}">
        <label for="precio">Precio</label>
        <input type="number" name="precio" id="nuevoPrecio" value="${productoEncontrado.precio}">
        <label for="stock">Cantidad disponible</label>
        <input type="number" name="stock" id="nuevoStock" value="${productoEncontrado.stock}">
        
        <div class="cardBtns">
            <button class="btn" id="btnConfirmarModificar">Aceptar</button>
            <button class="btn" id="btnCancelarModificar">Cancelar</button>
        </div>`

    const btnConfirmarModificar = document.getElementById('btnConfirmarModificar');
    const btnCancelarModificar = document.getElementById('btnCancelarModificar');

    // CONFIRMAR CAMBIOS

    btnConfirmarModificar.addEventListener('click', () => {
        const nuevoNombre = document.getElementById('nuevoNombre').value;
        const nuevaImagen = document.getElementById('nuevaImagen').value;
        const nuevoPrecio = document.getElementById('nuevoPrecio').value;
        const nuevoStock = document.getElementById('nuevoStock').value;
        modificarProducto(tarjetaId, nuevoNombre, nuevaImagen, nuevoPrecio, nuevoStock);
        crearTarjeta();

        Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            icon: 'success',
            title: 'Los cambios han sido guardados.',
        })
    })

    // CANCELAR CAMBIOS

    btnCancelarModificar.addEventListener('click', () => {
        Swal.fire({
            title: '¿Estás seguro de que deseas cancelar? Los cambios no serán guardados.',
            showCancelButton: true,
            confirmButtonText: 'Si, cancelar',
            cancelButtonText: `Volver`,
        }).then((result) => {
            if (result.isConfirmed) {
                crearTarjeta();
            };
        })
    })
}

//CREAR TARJETA

function crearTarjeta() {
    display.innerHTML = '';

    display.classList.add('displayGrid');

    let productosGuardados = JSON.parse(localStorage.getItem('productos'));

    productosGuardados.forEach(producto => {
        if (parseInt(producto.stock) == 0) {
            display.innerHTML += `<div class="card" id="${producto.id}">
                <h3>${producto.nombre}</h3>
                <img src="http://drive.google.com/uc?export=view&id=${producto.imagen}" alt="${producto.nombre}" width="200" height="200">
                <h4>$ ${producto.precio}</h4>
                <h4>SIN STOCK</h4>
            <div class="cardBtns loggedBtns">
                <button class="btn btnModificar">Modificar</button>
                <button class="btn btnEliminar">Eliminar</button>
            </div>
            </div>`
        } else if (parseInt(producto.stock) <= 5) {
            display.innerHTML += `<div class="card" id="${producto.id}">
                <h3>${producto.nombre}</h3>
                <img src="http://drive.google.com/uc?export=view&id=${producto.imagen}" alt="${producto.nombre}" width="200" height="200">
                <h4>$ ${producto.precio}</h4>
                <h4>¡Quedan ${producto.stock} disponibles!</h4>
            <div class="cardBtns loggedBtns">
                <button class="btn btnModificar">Modificar</button>
                <button class="btn btnEliminar">Eliminar</button>
            </div>
            <button class="btn loggedBtns dNone">Agregar al carrito</button>
            </div>`
        } else {
            display.innerHTML += `<div class="card" id="${producto.id}">
                <h3>${producto.nombre}</h3>
                <img src="http://drive.google.com/uc?export=view&id=${producto.imagen}" alt="${producto.nombre}" width="200" height="200">
                <h4>$ ${producto.precio}</h4>
            <div class="cardBtns loggedBtns">
                <button class="btn btnModificar">Modificar</button>
                <button class="btn btnEliminar">Eliminar</button>
            </div>
            <button class="btn loggedBtns dNone">Agregar al carrito</button>
            </div>`
        };
    })

    //BORRAR PRODUCTO

    const btnsEliminar = document.getElementsByClassName('btnEliminar');
    for (const btn of btnsEliminar) {
        btn.addEventListener('click', (e) => {
            Swal.fire({
                title: '¿Estás seguro de que deseas eliminar este producto?',
                showCancelButton: true,
                confirmButtonText: 'Eliminar',
                cancelButtonText: `Cancelar`,
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'El producto ha sido eliminado',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    borrarProducto(e.target.parentNode.parentNode.id);
                    crearTarjeta();
                };
            })
        })
    }

    //MODIFICAR PRODUCTO

    const btnsModificar = document.getElementsByClassName('btnModificar');
    for (const btn of btnsModificar) {
        btn.addEventListener('click', (e) => {
            inputsModificar(e.target.parentNode.parentNode.id);
        })
    }

}

// EVENTO CREAR TARJETA

btnNuevo.addEventListener('click', () => {
    if (nombre.value != '' && imagen.value != '' && precio.value != '' && stock.value != '') {
        agregarProducto(nombre.value, imagen.value, precio.value, stock.value);
        crearTarjeta();
    } else {
        Swal.fire('Todos los campos deben ser completados para crear un nuevo producto.')
    }
});

if (JSON.parse(localStorage.getItem('productos')) != null) {
    crearTarjeta();
}

if (display.innerHTML == '') {
    display.classList.remove('displayGrid');
    display.innerHTML = '<h3 class="noProducts">En este momento no hay productos cargados a la tienda.</h3>';
}


























// LOGIN

async function getDatabase() {
    const response = await fetch('./js/database.json');
    const database = await response.json();
    console.log(database);
    localStorage.setItem ('database', JSON.stringify(database));
}

getDatabase();

const database = JSON.parse(localStorage.getItem('database'));



/* async function getDatabase() {
    const response = await fetch('./js/database.json');
    const database = await response.json();
    localStorage.setItem ('database', JSON.stringify(database));s
    return database;
}

const database = getDatabase(); */

const loggedA = document.querySelectorAll('.loggedA'),
    loggedB = document.querySelectorAll('.loggedB'),
    loggedBtns = document.querySelectorAll('.loggedBtns'),
    iniciarSesion = document.getElementById('iniciarSesion'),
    cerrarSesion = document.getElementById('cerrarSesion');


function guardarIngreso(usuarioDB) {
    const usuario = {
        'firstName': usuarioDB.firstName,
        'lastName': usuarioDB.lastName,
        'email': usuarioDB.email,
        'password': usuarioDB.password,
        'authorized': usuarioDB.authorized
    }
    
    localStorage.setItem('usuario', JSON.stringify(usuario));
}

function borrarIngreso() {
    localStorage.removeItem('usuario');
    location.reload();
}

function recuperarUsuario() {
    const usuarioEnStorage = JSON.parse(localStorage.getItem('usuario'));
    return usuarioEnStorage;
}


function mostrar(array, clase) {
    for (let x of array) {
        x.classList.toggle(clase);
    }
}

mostrar(loggedBtns, 'dNone');

function iniciado(usuario) {
    if (usuario) {
        if (usuario.authorized) {
            mostrar(loggedA, 'dNone');
            mostrar(loggedBtns, 'dNone');
        } else {
            mostrar(loggedB, 'dNone');
        }
    }
}

function validarUsuario (usersDB, email, password) {
    let usuarioGuardado = usersDB.find((userDB) => userDB.email == email);

    if(typeof usuarioGuardado === 'undefined') {
        return 'Usuario y/o contraseña incorrectos'
    } else {
        if (usuarioGuardado.password != password) {
            return 'Usuario y/o contraseña incorrectos'
        } else {
            return usuarioGuardado;
        }
    }
}






iniciarSesion.addEventListener('click', (e) => {
    e.preventDefault();

    Swal.fire({
        title: 'Ingresá',
        html: `<input type="text" id="inputEmail" class="swal2-input" placeholder="Usuario o correo electrónico">
        <input type="password" id="inputPassword" class="swal2-input" placeholder="Contraseña">`,
        confirmButtonText: 'Ingresar',
        focusConfirm: false,
        preConfirm: () => {
            const inputEmail = Swal.getPopup().querySelector('#inputEmail').value
            const inputPassword = Swal.getPopup().querySelector('#inputPassword').value
            if (!inputEmail || !inputPassword) {
                Swal.showValidationMessage(`Todos los campos deben estar completos`)
            } else {
                let data = validarUsuario (database, inputEmail, inputPassword);
                if (typeof data === 'string') {
                    Swal.showValidationMessage(`Usuario y/o contraseña incorrectos`)
                } else {
                    guardarIngreso(data);
                    iniciado(data);
                }
            }
        }
    })
})



cerrarSesion.addEventListener('click', () => {
    borrarIngreso();
})


iniciado(recuperarUsuario());
























// PERFIL

const authorizedUsers = database.filter((el) => el.authorized),
    profileContainer = document.querySelector('profileContainer'),
    authorizedContainer = document.getElementById('authorizedContainer'),
    profileInfo = document.getElementById ('profileInfo'),
    authorizedProfiles = document.getElementById('authorizedProfiles'),
    usuario = JSON.parse(localStorage.getItem('usuario')),
    btnPerfil = document.getElementById('btnPerfil'),
    profile = document.querySelectorAll('.profile');

if (usuario){
    profileInfo.innerHTML = `<h2>Datos del usuario</h2>
        <h3>Nombre: ${usuario.firstName}</h3>
        <h3>Apellido: ${usuario.lastName}</h3>
        <h4>Correo electrónico: ${usuario.email}</h4>`;


    if (usuario.authorized){
        authorizedUsers.forEach(user => {
            if (usuario.password == user.password) {
                authorizedProfiles.innerHTML +=  `
                <div class= authorizedProfilesBoxes>
                    <figure>
                        <img src="../img/login.png" alt="perfil" width="100" height="100">
                    </figure>
                    <h4>YO</h4>
                    <h5>${user.email}</h5>
                </div>`
            } else {
                authorizedProfiles.innerHTML +=  `
                <div class= authorizedProfilesBoxes>
                    <figure>
                        <img src="../img/login.png" alt="perfil" width="100" height="100">
                    </figure>
                    <h4>${user.firstName} ${user.lastName}</h4>
                    <h5>${user.email}</h5>
                </div>`
            }
        });
    } else {
        authorizedContainer.classList.add('dNone')
    }
}


btnPerfil.addEventListener('click', () => {    
    mostrar(profile, 'dNone');

    if (btnPerfil.innerText == 'Mi perfil') {
        btnPerfil.innerText = 'Volver';
    } else {
        btnPerfil.innerText = 'Mi perfil';
    }
})