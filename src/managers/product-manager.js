import {promises as fs} from "fs";

class ProductManager {
    static ultId = 24; 
    constructor(path) {
        this.products = []; 
        this.path = path; 

    }

    //Agrega un producto
    async addProduct({title, description, price, status, img, code, stock, category}) {
        //Yo puedo leer el archivo y guardar el array con los productos: 
        const arrayProductos = await this.leerArchivo(); 

        //Validamos todos los campos menos la imagen: 
        if(!title || !description || !price || !status || !code || !stock || !category) {
            console.log("Todos los campos son obligatorios, a excepción de la imagen!"); 
            return; 
        }

        //Validamos que el código sea único: 
        if(arrayProductos.some(item => item.code === code)) {
            console.log("El codigo debe ser unico!"); 
            return; 
        }

        //Si es valido, crear el objeto: 
        const nuevoProducto = {
            id: ++ProductManager.ultId,
            title, 
            description,
            price,
            status,
            img,
            code,
            stock,
            category
        }

        //Una vez creado agregarlo al array: 
        arrayProductos.push(nuevoProducto); 

        //Guardar el array actualizado en el archivo: 
        await this.guardarArchivo(arrayProductos); 
    }

    //Actualiza un producto
    async updateProduct(id, camposParaActualizar) 
    {
        try {
            const productos = await this.leerArchivo(); // Método que lee el archivo JSON
            const productoIndex = productos.findIndex(item => item.id === id);

            if (productoIndex === -1) {
                throw new Error("Producto no encontrado");
            }

            const productoActual = productos[productoIndex];

            // Mantener el ID del producto sin cambios
            const productoActualizado = { ...productoActual, ...camposParaActualizar, id: productoActual.id };

            productos[productoIndex] = productoActualizado;
            await this.guardarArchivo(productos); // Método que escribe el archivo JSON

            return productoActualizado;
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            throw new Error("Error al actualizar el producto");
        }
    }

    //Eliminar un producto por ID
    async deleteProduct(id) {
        try {
            const productos = await this.leerArchivo(); // Método que lee el archivo JSON
            const index = productos.findIndex(item => item.id === id);

            if (index === -1) {
                throw new Error("Producto no encontrado");
            }

            productos.splice(index, 1);
            await this.guardarArchivo(productos); // Método que escribe el archivo JSON
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            throw new Error("Error al eliminar el producto");
        }
    }

    //Obtiene los productos con limitacion
    async getProducts(limit) {
        try {
            const productos = await this.leerArchivo(); // Método que lee el archivo JSON
            return limit ? productos.slice(0, limit) : productos;
        } catch (error) {
            console.error("Error al obtener los productos:", error);
            throw new Error("Error al obtener los productos");
        }
    }

    //Obtiene un producto por ID
    async getProductById(id) {
        //Leer el archivo y generar el array: 
        const arrayProductos = await this.leerArchivo();
        const producto = arrayProductos.find(item => item.id === id);

        if(!producto) {
            return "Not Found"; 
        } else {
            return producto; 
        }
    }

    //Guarda el archivo
    async guardarArchivo(arrayProductos) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2))
        } catch (error) {
            console.log("Tenemos un error al guardar el archivo"); 
        }
    }

    //Leer el archivo 
    async leerArchivo() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            const arrayProductos = JSON.parse(respuesta); 
            return arrayProductos; 
        } catch (error) {
            console.log("Error al leer el archivo"); 
        }
    }
}


export default ProductManager; 