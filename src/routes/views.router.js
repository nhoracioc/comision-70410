import { Router } from "express";
const router = Router(); 

import ProductManager from "../managers/product-manager.js";
const manager = new ProductManager("./src/data/productos.json"); 


// Entregar una lista de todos los productos
router.get("/products", async (req, res) => {
    try {
        const productos = await manager.getProducts();
        res.render("home", { productos });
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).send("Error al obtener los productos");
    }
});


//Lista de Productos con websockets: 
router.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts"); 
})


export default router; 