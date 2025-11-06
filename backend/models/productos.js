import mongoose from "mongoose";
const productSchema = new mongoose.Schema({ 
    productId: {type: String, required: true, unique:true},
    nombre: {type: String, required: true},
    descripcion: {type: String, required: true},
    precio: {type: Number, required: true},
    image: {type: String, required: true},
});
//forzamos para que me guarde la informacion en la coleccion de productos
const Product = mongoose.model("Productos", productSchema, "Productos");
export default Product;