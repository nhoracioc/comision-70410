const socket = io();

socket.on("productos", (data) => {
    renderProductos(data);
});

// Función para renderizar los productos
const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";
    productos.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <p><strong>Título:</strong> ${item.title}</p>
            <p><strong>Descripción:</strong> ${item.description}</p>
            <p><strong>Precio:</strong> $${item.price}</p>
            <button>Eliminar</button>
        `;
        contenedorProductos.appendChild(card);

        // Evento del botón de eliminar
        card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item.id);
        });
    });
};

const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id);
};

// Agregar los productos desde el formulario
document.getElementById("btnEnviar").addEventListener("click", () => {
    agregarProducto();
});

const agregarProducto = () => {
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
    };

    // Vaciar los campos del formulario después de agregar el producto
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("price").value = "";
    document.getElementById("img").value = "sin imagen";
    document.getElementById("code").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("category").value = "";
    document.getElementById("status").value = "true";  // Resetear el select al valor predeterminado  

    socket.emit("agregarProducto", producto);

   
    
};

