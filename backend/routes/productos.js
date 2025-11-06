import express from 'express';
import Productos from '../models/productos.js';

const router = express.Router();

router.post("/",async function(req, res){ 
    try {
        const {productId, nombre, descripcion, precio, image} = req.body;
        const newProduct = new Productos({productId, nombre, descripcion, precio, image});
        await newProduct.save();
        res.status(201).json({message: "Producto creado exitosamente"});
    } catch (error) {
        console.error("Error al crear el producto:", error);
        res.status(400).json({message: "Error al crear el producto"});
    }
})
export default router;