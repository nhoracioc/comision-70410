import { Router } from "express";
const router = Router(); 

import ProductManager from "../managers/product-manager.js";
const manager = new ProductManager("./src/data/productos.json"); 

//Entregar una lista de todos los productos
router.get("/products", async (req, res) => {
    //Pueden usar un try catch  y retornar un status 500 en caso de no acceder al manager y a los datos. 
    const productos = await manager.getProducts(); 
    res.render("home", {productos});
})

//Lista de Productos con websockets: 
router.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts"); 
})


export default router; 