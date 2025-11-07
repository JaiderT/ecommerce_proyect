import express from 'express';
import user from '../models/user.js';

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const {nombre, telefono, email, password} = req.body;
        if (!nombre || !telefono || !email || !password) {
            return res.status(400).json({message: "Faltan datos obligatorios"});
        }
        //validar si el usuario ya existe
        const existeuser = await user.find({email});
        if (existeuser) {
            return res.status(400).json({message: "El usuario ya existe"});
        }
        //crear el nuevo usuario
        const newuser = new user({nombre, telefono, email, password});
        await newuser.save();
        res.status(201).json({message: "Usuario creado exitosamente"});
    } catch (error) {
        res.status(500).json({message: "Error al crear el usuario",error:error.message});
    }
});
export default router;