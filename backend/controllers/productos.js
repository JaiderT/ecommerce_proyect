import Productos from "../models/productos.js";

//crear producto

export const crearproducto = async (req, res) => {
        try {
        const {productId, nombre, descripcion, precio, image} = req.body;
        const newProduct = new Productos({productId, nombre, descripcion, precio, image});
        await newProduct.save();
        res.status(201).json({message: "Producto creado exitosamente"});
    } catch (error) {
        console.error("Error al crear el producto:", error);
        res.status(404).json({message: "Error al crear el producto"});
    };
}
//traer loa datos de la base de datos
export const obtenerproductos = async(req, res) => {
    try { 
        const productos = await Productos.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({message: "Error al obtener los productos"});
    }
}
 