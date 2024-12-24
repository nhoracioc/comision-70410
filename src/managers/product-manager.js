//const fs = require("fs").promises; 
//con ESModules: import {promises as fs} from "fs"; 
import {promises as fs} from "fs";

//ACTIVIDAD 2: 

class ProductManager {
    static ultId = 0; 
    constructor(path) {
        this.products = []; 
        this.path = path; 
        //La clase debe contar con una variable this.path, el cual se inicializará desde el constructor y debe recibir la ruta a trabajar desde el momento de generar su instancia.

    }

    //id, title, description, price, status, img, code, stock, category

    async addProduct({title, description, price, status, img, code, stock, category}) {

        //Yo puedo leer el archivo y guardar el array con los productos: 
        const arrayProductos = await this.leerArchivo(); 

        //Validamos todos los campos: 
        // if(!title || !description || !price || !img || !code || !stock ) {
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
            img,
            code,
            stock
        }

        //Una vez creado agregarlo al array: 
        arrayProductos.push(nuevoProducto); 

        //Guardar el array actualizado en el archivo: 
        await this.guardarArchivo(arrayProductos); 
    }

    async getProducts() {
        const arrayProductos = await this.leerArchivo(); 
        return arrayProductos;
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

    //Se pueden armar unos métodos auxiliares que guarden el archivo y recuperen los datos: 

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

//module.exports = ProductManager; 
export default ProductManager; 