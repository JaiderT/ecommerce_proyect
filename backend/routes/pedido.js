import express from 'express';
import {crearpedido, obtenerpedido} from '../controllers/pedido.js';
const router=express.Router();

//ruta para crear productos
router.post("/", crearpedido);

//ruta para obtner los productos
router.get("/", obtenerpedido);

export default router;