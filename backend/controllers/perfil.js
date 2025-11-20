//importamos el modelo
import user from "../models/user.js"

//obtener perfil del usuario de la base de datos

export const obtenerperfil =async (req, res) => {
    try {
        const {email} = req.body;
        if(!email){
            return res.status(400).json({message:"Email es requerido"});
        }
        //traer el correo del usuario
        const usuario = await user.findOne({email:email}).select('-password')
        if(!usuario){
            return res.status(400).json({message:"Usuario no encontrado"});
        }
        res.status(200).json({
            usuario:{
                id: usuario._id,
                nombre: usuario.nombre,
                telefono: usuario.telefono,
                email: usuario.email
            }
        })
    } catch (error) {
        res.status(500).json({
            message:"Error al obtener el perfil", error: error.message
        })        
    }
}