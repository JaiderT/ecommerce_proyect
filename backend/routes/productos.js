import express from 'express';
import {crearproducto, obtenerproductos} from '../controllers/productos.js';
const router=express.Router();

//ruta para crear productos
router.post("/", crearproducto);

//ruta para obtner los productos
router.get("/", obtenerproductos);

export default router;