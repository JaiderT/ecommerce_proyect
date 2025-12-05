import Pedido from "../models/pedido.js";

export const crearpedido = async (req, res) => {
    try {
        const {pedidoId, email, direccion, nombre_productos, cantida_producto, metodo_pago,fecha_pedido, estado, total } = req.body;
        const newpedido = new Pedido({pedidoId, email, direccion, nombre_productos, cantida_producto, metodo_pago, fecha_pedido, estado, total});
        await newpedido.save();

        res.status(200).json({
            message: "Pedido creado exitosamente"
        });

    } catch (error) {
        console.error("Error al crear el producto:", error);
        
        res.status(404).json({
            message: "Error al cargar el pedido"
        });
    };
}

export const obtenerpedido = async(req, res) => {
    try {
        const pedido = await Pedido.find();
        res.json(pedido);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener los productos"
        });
    }
}