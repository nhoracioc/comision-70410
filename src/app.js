import express from "express"; 
import { engine } from "express-handlebars";
import { Server } from "socket.io";

const app = express(); 
const PUERTO = 8080; 

import cartRouter from "./routes/cart.router.js";
import productRouter from "./routes/product.router.js";
import viewsRouter from "./routes/views.router.js";

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true})); 
app.use(express.static("./src/public"));

//Express-Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars"); 
app.set("views", "./src/views"); 

 

//Rutas
app.use("/api/products", productRouter); 
app.use("/api/carts", cartRouter); 
app.use("/", viewsRouter); 


//Listen  
const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchando en el puerto: ${PUERTO}`);
})

//WEBSOCKETS
import ProductManager from "./managers/product-manager.js";
const manager = new ProductManager("./src/data/productos.json"); 

const io = new Server(httpServer); 

io.on("connection", async (socket) => {
  console.log("Un cliente se conecto");

  //Enviamos el array de productos al cliente que se conectó. 
  socket.emit("productos", await manager.getProducts()); 

  //Agregar un producto: 
  socket.on("agregarProducto", async (producto) => {
    await manager.addProduct(producto); 
    io.sockets.emit("productos", await manager.getProducts())
  })

  //Eliminar un producto: 
  socket.on("eliminarProducto", async (id) => {
    //Usar el metodo de eliminar del manager. 
    await manager.deleteProduct(id);

    //Despues de eliminar enviar nuevamente el listado de productos actualizado. 
    io.sockets.emit("productos", await manager.getProducts())
  })


})