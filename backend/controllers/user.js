import user from "../models/user.js";
import bcrypt from "bcrypt";

//creacion de los usuarios
export const registraruser = async(req, res) => {
    try {
        const {nombre, telefono, email, password} = req.body;
        if (!nombre || !telefono || !email || !password) {
            return res.status(400).json({message: "Faltan datos obligatorios"});
        }
        //validar si el usuario ya existe
        const existeuser = await user.findOne({email});
        if (existeuser) {
            return res.status(400).json({message: "El usuario ya existe"});
        }
        //encriptar la contraseña 
        
        const saltrounds=10;
        const hashedPassword = await bcrypt.hash(password, saltrounds)

        //crear el nuevo usuario
        const newuser = new user({nombre, telefono, email, password:hashedPassword});
        await newuser.save();
        res.status(201).json({message: "Usuario creado exitosamente"});
    } catch (error) {
        res.status(500).json({message: "Error al crear el usuario",error:error.message});
    };
}