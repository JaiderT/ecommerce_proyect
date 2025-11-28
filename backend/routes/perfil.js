import express from "express"
import { obtenerperfil, perfilactualizado, perfildelete} from "../controllers/perfil.js";

const router = express.Router();

router.post('/obtener',obtenerperfil);
router.put('/actualizar', perfilactualizado);
router.delete('/eliminar', perfildelete)

export default router;