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
// Actualizar perfil
export const perfilactualizado = async (req, res) => {
    try {
        const {nombre, telefono, email} = req.body;

        //validamos campos 
        if (!email) {
            return res.status(400).json({message: "Email es requerido" });
        }
        if(!nombre || !telefono) {
            return res.status(400).json({message: "Todos los campos son obligatorios "});
        }
        const Actualizarusuario = await user.findOneAndUpdate(
            {email:email},
            {
                nombre: nombre,
                telefono: telefono
            },
            {new: true}
        ).select('-passwords');
        if(!Actualizarusuario) {
            return res.status(404).json({message: "Usuario no encontrado"});
        }
        res.status(200).json({
            message:"Perfil Actualizado Exitosamnete",
            usuario: {
                id: Actualizarusuario._id,
                nombre: Actualizarusuario.nombre,
                telefono: Actualizarusuario.telefono,
                email: Actualizarusuario.email
            }
        });
    } catch (error) {
        res.status(500).json({
            message:"Erros al actualizar perfil", error: error.message
        });
    }
};
//Eliminar Perfil
export const perfildelete = async (req, res) => {
    try {
        const {email} = req.body;
        //validar que el email este presente
        if (!email) {
            return res.status(400).json({message:"email es requerido"});
        }
        //buscar y eliminar user
        const deleteuser = await user.findOneAndDelete ({
            email: email
        });
        if (!deleteuser) {
            return res.status(404).json({message: "Usuario no encontrado"});
        }
        res.status(200).json({
            message: "Usuario eliminado exitosamente",
            usuario: {
                id: deleteuser._id,
                nombre: deleteuser.nombre,
                telefono: deleteuser.telefono,
                email: deleteuser.email
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar perfil", error: error.message
        });
    }
};
