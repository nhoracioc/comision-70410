import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ]
});

// Middleware que realiza la población automáticamente, con id, titulo y precio
cartSchema.pre('findOne', function (next) {
  this.populate('products.product', 'id title description Price code stock category status');
  next();
});

const CartModel = mongoose.model("carts", cartSchema);

export default CartModel;


