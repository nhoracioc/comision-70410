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
});


//Ruta para agregar un producto
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

//Ruta para actualizar un producto
router.put("/:pid", async (req, res) => {
    const productId = parseInt(req.params.pid);
    const { title, description, price, status, code, stock, category, img } = req.body;

    if (!title && !description && !price && !code && !stock && !category && !img && status === undefined) {
        return res.status(400).json({ error: "Al menos un campo debe ser proporcionado para actualizar el producto" });
    }

    const camposParaActualizar = { title, description, price, code, stock, category, img, status };

    try {
        const productoActualizado = await manager.updateProduct(productId, camposParaActualizar);
        res.json(productoActualizado);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto!" });
    }
});

//Ruta para eliminar un producto
router.delete("/:pid", async (req, res) => {
    const productId = parseInt(req.params.pid);

    try {
        await manager.deleteProduct(productId);
        res.json({ message: "Producto eliminado con éxito!" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto!" });
    }
});


export default router; 