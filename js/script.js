
const titulo = document.getElementById('titulo'),
    tituloPagina = document.getElementById('tituloPagina'),
    inputTitulo = document.getElementById('inputTitulo'),
    btnTitulo = document.getElementById('btnTitulo'),
    btnResetTitulo = document.getElementById('btnResetTitulo');

function cambiarTitulo() {
    const nuevoTitulo = inputTitulo.value,
        nuevoTituloPagina = `${inputTitulo.value} | Tienda Virtual`;

    if (nuevoTitulo == '') {
        Swal.fire('Debes ingresar algún valor para poder cambiar el título de la tienda.');
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

btnResetTitulo.addEventListener('click', resetearTitulo);

if (localStorage.getItem('nuevoTitulo') != null) {
    titulo.innerText = localStorage.getItem('nuevoTitulo');
    tituloPagina.innerText = localStorage.getItem('nuevoTituloPagina');
}

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
    this.precio = parseInt(precio);
    this.stock = parseInt(stock);
    this.cantidad = 1;
    this.precioTotal = parseInt(precio);
    this.fecha = new Date().toLocaleString();
}

function agregarProducto(nombre, imagen, precio, stock) {
    const producto = new Producto(nombre, imagen, precio, stock);
    productos.unshift(producto);

    localStorage.setItem('productos', JSON.stringify(productos));
}

function borrarProducto(objectId) {
    const productoIndex = productos.findIndex(producto => producto.id === objectId);
    productos.splice(productoIndex, 1);
    localStorage.setItem('productos', JSON.stringify(productos));
}

function modificarProducto(objectId, nuevoNombre, nuevaImagen, nuevoPrecio, nuevoStock, nuevaFecha) {
    const productoIndex = productos.findIndex(producto => producto.id === objectId);
    productos[productoIndex].nombre = nuevoNombre;
    productos[productoIndex].imagen = nuevaImagen;
    productos[productoIndex].precio = nuevoPrecio;
    productos[productoIndex].stock = nuevoStock;
    productos[productoIndex].fecha = nuevaFecha;
    localStorage.setItem('productos', JSON.stringify(productos));
}

function inputsModificar(tarjetaId) {
    const tarjetadeProducto = document.getElementById(tarjetaId);
    const productoEncontrado = productos.find(producto => producto.id === tarjetaId);
    tarjetadeProducto.innerHTML = `
        <h5>Última modificación: ${productoEncontrado.fecha}</h5>
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
        </div>`;

    const btnConfirmarModificar = document.getElementById('btnConfirmarModificar');
    const btnCancelarModificar = document.getElementById('btnCancelarModificar');

    btnConfirmarModificar.addEventListener('click', () => {
        const nuevoNombre = document.getElementById('nuevoNombre').value;
        const nuevaImagen = document.getElementById('nuevaImagen').value;
        const nuevoPrecio = document.getElementById('nuevoPrecio').value;
        const nuevoStock = document.getElementById('nuevoStock').value;
        const nuevaFecha = new Date().toLocaleString();
        modificarProducto(tarjetaId, nuevoNombre, nuevaImagen, nuevoPrecio, nuevoStock, nuevaFecha);
        crearTarjeta();

        Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            icon: 'success',
            title: 'Los cambios han sido guardados.',
        });
    });

    btnCancelarModificar.addEventListener('click', () => {
        Swal.fire({
            title: '¿Estás seguro de que deseas cancelar? Los cambios no serán guardados.',
            showCancelButton: true,
            confirmButtonText: 'Si, cancelar',
            cancelButtonText: `Volver`,
        }).then((result) => {
            if (result.isConfirmed) {
                crearTarjeta();
            }
        });
    });
}

function crearTarjeta() {
    display.innerHTML = '';

    display.classList.add('displayGrid');

    let productosGuardados = JSON.parse(localStorage.getItem('productos'));

    productosGuardados.forEach(producto => {
        if (producto.stock == 0) {
            display.innerHTML += `<div class="card" id="${producto.id}">
                <h3>${producto.nombre}</h3>
                <img src="http://drive.google.com/uc?export=view&id=${producto.imagen}" alt="${producto.nombre}" width="200" height="200">
                <h4>$ ${producto.precio}</h4>
                <h4>SIN STOCK</h4>
            <div class="cardBtns loggedBtns">
                <button class="btn btnModificar">Modificar</button>
                <button class="btn btnEliminar">Eliminar</button>
            </div>
            </div>`;
        } else if (producto.stock == 1) {
            display.innerHTML += `<div class="card" id="${producto.id}">
                <h3>${producto.nombre}</h3>
                <img src="http://drive.google.com/uc?export=view&id=${producto.imagen}" alt="${producto.nombre}" width="200" height="200">
                <h4>$ ${producto.precio}</h4>
                <h4>¡Último disponible!</h4>
            <div class="cardBtns loggedBtns">
                <button class="btn btnModificar">Modificar</button>
                <button class="btn btnEliminar">Eliminar</button>
            </div>
            <button class="btn btnAgregarCarrito loggedBtns dNone">Agregar al carrito</button>
            </div>`;
        } else if (producto.stock <= 5) {
            display.innerHTML += `<div class="card" id="${producto.id}">
                <h3>${producto.nombre}</h3>
                <img src="http://drive.google.com/uc?export=view&id=${producto.imagen}" alt="${producto.nombre}" width="200" height="200">
                <h4>$ ${producto.precio}</h4>
                <h4>¡Quedan ${producto.stock} disponibles!</h4>
            <div class="cardBtns loggedBtns">
                <button class="btn btnModificar">Modificar</button>
                <button class="btn btnEliminar">Eliminar</button>
            </div>
            <button class="btn btnAgregarCarrito loggedBtns dNone">Agregar al carrito</button>
            </div>`;
        } else {
            display.innerHTML += `<div class="card" id="${producto.id}">
                <h3>${producto.nombre}</h3>
                <img src="http://drive.google.com/uc?export=view&id=${producto.imagen}" alt="${producto.nombre}" width="200" height="200">
                <h4>$ ${producto.precio}</h4>
            <div class="cardBtns loggedBtns">
                <button class="btn btnModificar">Modificar</button>
                <button class="btn btnEliminar">Eliminar</button>
            </div>
            <button class="btn btnAgregarCarrito loggedBtns dNone">Agregar al carrito</button>
            </div>`;
        }
    });

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
                }
            });
        });
    }

    const btnsModificar = document.getElementsByClassName('btnModificar');
    for (const btn of btnsModificar) {
        btn.addEventListener('click', (e) => {
            inputsModificar(e.target.parentNode.parentNode.id);
        });
    }

}

btnNuevo.addEventListener('click', () => {
    if (nombre.value != '' && imagen.value != '' && precio.value != '' && stock.value != '') {
        agregarProducto(nombre.value, imagen.value, precio.value, stock.value);
        crearTarjeta();
    } else {
        Swal.fire('Todos los campos deben ser completados para crear un nuevo producto.');
    }
});

if (JSON.parse(localStorage.getItem('productos')) != null) {
    crearTarjeta();
}

if (display.innerHTML == '') {
    display.classList.remove('displayGrid');
    display.innerHTML = '<h3 class="noProducts">En este momento no hay productos cargados a la tienda.</h3>';
}

async function getDatabase() {
    const response = await fetch('./js/database.json');
    const database = await response.json();
    /* console.log(database); */
    localStorage.setItem('database', JSON.stringify(database));
}

getDatabase();

const registrar = document.getElementById('registrar'),
    registro = document.querySelectorAll('.registro'),
    nombreReg = document.getElementById('nombreReg'),
    apellidoReg = document.getElementById('apellidoReg'),
    emailReg = document.getElementById('emailReg'),
    contrasenaReg = document.getElementById('contrasenaReg'),
    contrasenaCheckReg = document.getElementById('contrasenaCheckReg'),
    btnCrearCuenta = document.getElementById('btnCrearCuenta'),
    regProblem = document.getElementById('regProblem'),
    registrados = JSON.parse(localStorage.getItem('registrados')) || [];

registrar.addEventListener('click', () => {
    mostrar(registro, 'dNone');

    if (registrar.innerText == 'Registrarme') {
        registrar.innerText = 'Volver a la tienda';
    } else {
        registrar.innerText = 'Registrarme';
    }
})

function Cuenta(nombre, apellido, email, contrasena) {
    this.firstName = nombre;
    this.lastName = apellido;
    this.email = email;
    this.password = contrasena;
    this.authorized = false;
}

function agregarCuenta(nombre, apellido, email, contrasena) {
    const cuenta = new Cuenta(nombre, apellido, email, contrasena);

    registrados.push(cuenta);

    localStorage.setItem('registrados', JSON.stringify(registrados));

    return cuenta;
};

function validarEmail(email) {
    const validacion = /\S+@\S+\.\S+/;
    return validacion.test(email);
};

btnCrearCuenta.addEventListener('click', () => {

    if (nombreReg.value != '' && apellidoReg.value != '' && emailReg.value != '' && contrasenaReg.value != '' && contrasenaCheckReg.value != '') {

        if (validarEmail(emailReg.value)) {

            if (contrasenaReg.value.length >= 6) {

                if (contrasenaReg.value === contrasenaCheckReg.value) {

                    agregarCuenta(nombreReg.value, apellidoReg.value, emailReg.value, contrasenaReg.value);
                    regProblem.innerHTML = '';

                    Swal.fire({
                        toast: true,
                        position: 'bottom',
                        showConfirmButton: false,
                        timer: 3000,
                        icon: 'success',
                        title: 'Te registraste con éxito!',
                    });

                    setTimeout(() => {
                        location.reload();
                    }, 3000);

                } else {
                    regProblem.innerHTML = `<h5>* Las contraseñas no coinciden.</h5>`;
                }

            } else {
                regProblem.innerHTML = `<h5>* La contraseña debe tener al menos 6 caracteres.</h5>`;
            }

        } else {
            regProblem.innerHTML = `<h5>* La dirección de correo electrónico no es válida.</h5>`;
        }

    } else {
        regProblem.innerHTML = `<h5>* Todos los campos deben ser completados para poder registrarse.</h5>`;
    }
});

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
    };

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

function validarUsuario(usersDB, email, password) {
    let usuarioGuardado = usersDB.find((userDB) => userDB.email == email);

    if (typeof usuarioGuardado === 'undefined') {
        return 'Usuario y/o contraseña incorrectos';
    } else {
        if (usuarioGuardado.password != password) {
            return 'Usuario y/o contraseña incorrectos';
        } else {
            return usuarioGuardado;
        }
    }
}

iniciarSesion.addEventListener('click', () => {

    const database = JSON.parse(localStorage.getItem('database'));

    Swal.fire({
        title: 'Ingresá',
        html: `<input type="text" id="inputEmail" class="swal2-input" placeholder="Usuario o correo electrónico">
        <input type="password" id="inputPassword" class="swal2-input" placeholder="Contraseña">`,
        confirmButtonText: 'Ingresar',
        focusConfirm: false,
        preConfirm: () => {
            const inputEmail = Swal.getPopup().querySelector('#inputEmail').value;
            const inputPassword = Swal.getPopup().querySelector('#inputPassword').value;
            if (!inputEmail || !inputPassword) {
                Swal.showValidationMessage(`Todos los campos deben estar completos`);
            } else {
                let data = validarUsuario(database, inputEmail, inputPassword);
                if (typeof data === 'string') {
                    let data = validarUsuario(registrados, inputEmail, inputPassword);
                    if (typeof data === 'string') {
                        Swal.showValidationMessage(`Usuario y/o contraseña incorrectos`);
                    } else {
                        guardarIngreso(data);
                        iniciado(data);
                        location.reload();
                    }
                } else {
                    guardarIngreso(data);
                    iniciado(data);
                    location.reload();
                }
            }
        }
    });
});

cerrarSesion.addEventListener('click', () => {
    borrarIngreso();
});

iniciado(recuperarUsuario());

const database = JSON.parse(localStorage.getItem('database')),
    usuario = JSON.parse(localStorage.getItem('usuario')),
    authorizedUsers = database.filter(el => el.authorized),
    authorizedContainer = document.getElementById('authorizedContainer'),
    profileInfo = document.getElementById('profileInfo'),
    authorizedProfiles = document.getElementById('authorizedProfiles'),
    btnPerfil = document.getElementById('btnPerfil'),
    profile = document.querySelectorAll('.profile');

if (usuario) {
    profileInfo.innerHTML = `<h2>Datos del usuario</h2>
        <h3>Nombre: ${usuario.firstName}</h3>
        <h3>Apellido: ${usuario.lastName}</h3>
        <h4>Correo electrónico: ${usuario.email}</h4>`;

    if (usuario.authorized) {
        authorizedUsers.forEach(user => {
            if (usuario.email == user.email) {
                authorizedProfiles.innerHTML += `
                <div class= authorizedProfilesBoxes>
                    <figure>
                        <img src="../img/login.png" alt="perfil" width="100" height="100">
                    </figure>
                    <h4>YO</h4>
                    <h5>${user.email}</h5>
                </div>`;
            } else {
                authorizedProfiles.innerHTML += `
                <div class= authorizedProfilesBoxes>
                    <figure>
                        <img src="../img/login.png" alt="perfil" width="100" height="100">
                    </figure>
                    <h4>${user.firstName} ${user.lastName}</h4>
                    <h5>${user.email}</h5>
                </div>`;
            }
        });
    } else {
        authorizedContainer.classList.add('dNone');
    }
}

btnPerfil.addEventListener('click', () => {
    mostrar(profile, 'dNone');

    if (btnPerfil.innerText == 'Mi perfil') {
        btnPerfil.innerText = 'Volver';
    } else {
        btnPerfil.innerText = 'Mi perfil';
    }
});

const carrito = JSON.parse(localStorage.getItem('carrito')) || [],
    carritoContainer = document.getElementById('carritoContainer'),
    btnAgregarCarrito = document.getElementsByClassName('btnAgregarCarrito'),
    carritoBtn = document.querySelector('.carritoBtn'),
    btnVaciarCarrito = document.getElementById('btnVaciarCarrito'),
    btnModal = document.getElementById('btnModal'),
    carritoLength = document.getElementById('carritoLength'),
    precioTotal = document.getElementById('precioTotal');

function agregarAlCarrito(objectId) {
    const agregado = carrito.some(producto => producto.id === objectId);

    if (agregado) {
        const prod = carrito.map(prod => {
            if (prod.id === objectId) {
                if (prod.cantidad < prod.stock) {
                    prod.cantidad++;
                    prod.precioTotal = prod.precio * prod.cantidad;
                    localStorage.setItem('carrito', JSON.stringify(carrito));

                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        icon: 'success',
                        title: `Se agregó ${prod.nombre} al carrito.`,
                    });
                } else {
                    Swal.fire({
                        toast: true,
                        position: 'bottom-end',
                        showConfirmButton: false,
                        timer: 3000,
                        icon: 'error',
                        title: '¡Lo sentimos! \nNo hay suficiente stock de este producto.',
                    });
                }
            }
        })
    } else {
        const producto = productos.find(producto => producto.id === objectId);
        carrito.push(producto);
        localStorage.setItem('carrito', JSON.stringify(carrito));

        Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            icon: 'success',
            title: `Se agregó ${producto.nombre} al carrito.`,
        });
    }
    actualizarCarrito();
}

for (const btn of btnAgregarCarrito) {
    btn.addEventListener('click', (e) => {
        agregarAlCarrito(e.target.parentNode.id);
    })
}

function eliminarDelCarrito(objectId) {
    const productoIndex = carrito.findIndex(producto => producto.id === objectId);
    carrito.splice(productoIndex, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

carritoLength.innerText = `${carrito.length}`;

function actualizarCarrito() {
    carritoContainer.innerHTML = '';

    carrito.forEach(producto => {

        carritoContainer.innerHTML += `<div class="productoEnCarrito" id="${producto.id}">
        <figure>
            <img src="http://drive.google.com/uc?export=view&id=${producto.imagen}" alt="${producto.nombre}" width="80" height="80">
        </figure>
        <div class="productoEnCarrito--info">
            <h4>${producto.nombre}</h4>
            <h5>$ ${producto.precio}</h5>
            <h5>Cantidad: ${producto.cantidad}</h5>
        </div>
        <div class="productoEnCarrito--total">
            <h4>$ ${producto.precioTotal}</h4>
        </div>
        <div class="productoEnCarrito--eliminar">
        <button class="btnEliminarCarrito"><abbr title="Eliminar del carrito">X</abbr></button>
        </div>
        </div>`;
    });

    carritoLength.innerText = `${carrito.length}`;

    precioTotal.innerText = `Precio total: $ ${carrito.reduce((previousValue, producto) => previousValue + parseInt(producto.precioTotal), 0)}`;

    const btnEliminarCarrito = document.querySelectorAll('.btnEliminarCarrito');
    for (const btn of btnEliminarCarrito) {
        btn.addEventListener('click', (e) => {
            eliminarDelCarrito(e.target.parentNode.parentNode.parentNode.id);
            actualizarCarrito();
        })
    }
}

function vaciarCarrito() {
    carrito.length = 0;
    localStorage.removeItem('carrito');
}

btnVaciarCarrito.addEventListener('click', () => {
    vaciarCarrito();
    actualizarCarrito();
    carritoContainer.innerHTML = `<h4 class="noCarrito">En este momento no hay productos agregados a tu carrito.</h4>`;
})

btnModal.addEventListener('click', () => {
    actualizarCarrito();

    if (carritoContainer.innerHTML == '') {
        carritoContainer.innerHTML = `<h4 class="noCarrito">En este momento no hay productos agregados a tu carrito.</h4>`;
    }
});

const btnComprar = document.getElementById('btnComprar'),
    compra = document.querySelectorAll('.compra'),
    datosUsuarioCompra = document.getElementById('datosUsuarioCompra'),
    btnConfirmarCompra = document.getElementById('btnConfirmarCompra'),
    carritoCompra = document.getElementById('carritoCompra'),
    compraDirec = document.getElementById('compraDirec'),
    compraAltura = document.getElementById('compraAltura'),
    compraCP = document.getElementById('compraCP'),
    compraProblem = document.getElementById('compraProblem');

function rellenarDatos() {
    if (usuario) {
        datosUsuarioCompra.innerHTML = `<label for="compraNombre">Nombre completo</label>
        <input type="text" name="compraNombre" id="compraNombre" value="${usuario.firstName} ${usuario.lastName}">
        <label for="compraEmail">Dirección de correo electrónico</label>
        <input type="email" name="compraEmail" id="compraEmail" value="${usuario.email}">`
    } else {
        datosUsuarioCompra.innerHTML = `<label for="compraNombre">Nombre completo</label>
        <input type="text" name="compraNombre" id="compraNombre">
        <label for="compraEmail">Dirección de correo electrónico</label>
        <input type="email" name="compraEmail" id="compraEmail">`
    }
}

btnComprar.addEventListener('click', () => {

    if (carrito.length === 0) {
        Swal.fire('Debes seleccionar al menos un producto para poder realizar tu compra.');
    } else {
        mostrar(compra, 'dNone');
        rellenarDatos();

        carrito.forEach(producto => {
            carritoCompra.innerHTML += `<div class="productoEnCarrito">
            <figure>
            <img src="http://drive.google.com/uc?export=view&id=${producto.imagen}" alt="${producto.nombre}" width="80" height="80">
            </figure>
            <div class="productoEnCarrito--info">
            <h4>${producto.nombre}</h4>
            <h5>$ ${producto.precio}</h5>
            <h5>Cantidad: ${producto.cantidad}</h5>
            </div>
            <div class="productoEnCarrito--total">
            <h4>$ ${producto.precio}</h4>
            </div>
            </div>`;
        })
    }
})

function restarStock() {
    let productosGuardados = JSON.parse(localStorage.getItem('productos'));

    carrito.forEach(producto => {
        let idCarrito = producto.id;
        let cantidadCarrito = producto.cantidad;

        let productoAModificar = productosGuardados.find(producto => producto.id === idCarrito);

        let nuevoStock = productoAModificar.stock - cantidadCarrito;

        productosGuardados.forEach(producto => {
            if (idCarrito === producto.id) {
                producto.stock = nuevoStock;
            }
        });
    });

    localStorage.setItem('productos', JSON.stringify(productosGuardados));
}

btnConfirmarCompra.addEventListener('click', () => {

    const compraNombre = document.getElementById('compraNombre'),
        compraEmail = document.getElementById('compraEmail');

    if (compraNombre.value != '' && compraEmail.value != '' && compraDirec.value != '' && compraAltura.value != '' && compraCP.value != '') {
        if (validarEmail(compraEmail.value)) {

            restarStock();

            Swal.fire({
                position: 'center',
                title: `¡Gracias por realizar tu compra con nosotros!
                En el transcurso del día la enviaremos a ${compraDirec.value} ${compraAltura.value}.`,
                showConfirmButton: false,
                timer: 3000
            })

            vaciarCarrito();

            setTimeout(() => {
                location.href = "index.html";
            }, 3500);

        } else {
            compraProblem.innerHTML = `<h5>* La dirección de correo electrónico no es válida.</h5>`;
        }
    } else {
        compraProblem.innerHTML = `<h5>* Todos los campos deben ser completados para poder realizar la compra.</h5>`;
    }
})