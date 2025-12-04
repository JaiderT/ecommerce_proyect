import mongoose from "mongoose";
const pedidoSchema = new mongoose.Schema({ 
    pedidoId: {type: String, required: true, unique:true},
    email: {type: String, required: true},
    direccion: {type: String, required: true},
    nombre_productos: {type:[String], required: true},
    cantida_producto: {type:Number, required:true},
    metodo_pago: {type:String, required:true},
    fecha_pedido: {type:Date, required:true},
    estado: {type:String,enum: ["pendiente", "procesando", "enviado", "entregado", "cancelado"], default :"pendiente" },
    total: {type: Number, required: true},
});
//forzamos para que me guarde la informacion en la coleccion de productos
const pedido = mongoose.model("pedido", pedidoSchema, "pedido");
export default pedido;