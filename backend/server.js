import express from 'express';
import cors from 'cors';
import "./db/db.js";
import ProductosRoutes from './routes/productos.js'
import userRoutes from './routes/user.js';
import { loginusuario } from './controllers/login.js';

const app = express();

//habilitar todas las rutas
app.use(cors());
app.use(express.json());
//primera ruta

app.get('/', (req, res) => { 
    res.send('Bienvenido al curso de node express');
});
app.use("/api/productos", ProductosRoutes);
app.use("/api/user", userRoutes);
app.use("/api/login", loginusuario);

app.listen(8081, () => console.log('Servidor corriendo en http://localhost:8081') )