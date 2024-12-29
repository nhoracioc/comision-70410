import { Router } from "express";
const router = Router(); 

//Importamos el productManager: 
import ProductManager from "../managers/product-manager.js"; 
const manager = new ProductManager("./src/data/productos.json"); 


//Ruta para listar todos los productos con limitacion: 
router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const productos = await manager.getProducts(limit);
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos!" });
    }
});


//Ruta para retornar un producto por id: 
router.get("/:pid",  async (req, res) => {
    let id = req.params.pid; 
    const productoBuscado = await manager.getProductById(parseInt(id)); 
    console.log("Producto buscado:", productoBuscado);
    res.send(productoBuscado); 
})

router.post("/", async (req, res) => {
    const { title, description, price, status, code, stock, category, img } = req.body;

    if (!title || !description || !price || !status || !code || !stock || !category) {
        return res.status(400).json({ error: "Todos los campos son obligatorios, a excepción de imagen." });
    }

    const nuevoProducto = {
        title, 
        description,
        price,
        status,
        img,
        code,
        stock,
        category
    };

    try {
        const productoAgregado = await manager.addProduct(nuevoProducto);
        res.status(201).json(productoAgregado);
    } catch (error) {
        res.status(500).json({ error: "Error al agregar el producto!" });
    }
});

export default router; 