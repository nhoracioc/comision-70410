import {promises as fs} from "fs";

class ProductManager {
    static ultId = 11; 
    constructor(path) {
        this.products = []; 
        this.path = path; 

    }

    async addProduct({title, description, price, status, img, code, stock, category}) {
        //Yo puedo leer el archivo y guardar el array con los productos: 
        const arrayProductos = await this.leerArchivo(); 

        //Validamos todos los campos: 
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

     async guardarArchivo(arrayProductos) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2))
        } catch (error) {
            console.log("Tenemos un error al guardar el archivo"); 
        }
    }

    async leerArchivo() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            const arrayProductos = JSON.parse(respuesta); 
            return arrayProductos; 
        } catch (error) {
            console.log("Tenemos un error al leer el archivo"); 
        }
    }
}


export default ProductManager; 