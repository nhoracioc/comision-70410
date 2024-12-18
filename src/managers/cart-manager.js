import {promises as fs} from "fs"; 

class CartManager {
    constructor(path) {
        this.carts = []; 
        this.path = path; 
        this.ultId = 0; 

        //Cargo los carritos almacenados en el archivo: 
        this.cargarCarritos(); 
    }

    async cargarCarritos() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data); 
            if(this.carts.length > 0) {
                //Ver si hay por lo menos un carrito creado. 
                this.ultId = Math.max(...this.carts.map(cart => cart.id))
                //Con map crear un nuevo array que solo obtenga los ids del carrito y con Math.max obtengo el mayor. 
            }
        } catch (error) {
            //Si no existe el archivo, crearlo: 
            await this.guardarCarritos(); 
        }
    }

    async guardarCarritos() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2)); 
    }

    // Crea el carrito
    async crearCarrito() {
        const nuevoCarrito = {
            id: ++this.ultId,
            products: []
        }

        this.carts.push(nuevoCarrito); 

        //Guardar el array en el archivo: 
        await this.guardarCarritos(); 
        return nuevoCarrito;
    }

    // Buscar Carrito por ID
    async getCarritoById(cartId) {
        const carrito = this.carts.find(c => c.id === cartId); 

        if(!carrito) {
            throw new Error("No existe un carrito con ese id"); 
        }

        return carrito; 
        //Se puede usar un try catch. 
    }

    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        const carrito = await this.getCarritoById(cartId); 

        //Ver si el producto ya existe en el carrito: 
        const existeProducto = carrito.products.find(p => p.product === productId); 

        //Si existe en el carrito, le aumento la cantidad. 
        //En caso contrario. 
        if(existeProducto) {
            existeProducto.quantity += quantity; 
        } else {
            carrito.products.push({product: productId, quantity}); 
        }

        await this.guardarCarritos(); 
        return carrito; 

    }

}

export default CartManager; 