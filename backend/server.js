import express from 'express';
import cors from 'cors';
import "./db/db.js";

const app = express();

//habilitar todas las rutas

app.use(cors());

//primera ruta

app.get('/', (req, res) => { 
    res.send('Bienvenido al curso de node express');
});

app.listen(8081, () => console.log('Servidor corriendo en http://localhost:8081') )