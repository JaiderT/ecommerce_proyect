import mongoose from 'mongoose';
const uri ="mongodb+srv://adsotarde:adso2025@ecommer.4ccsxoe.mongodb.net/Tienda?retryWrites=true&w=majority";
mongoose.connect(uri)
.then( () => console.log("✅ Conectado a la base de datos"))
.catch(err => console.log("❌ Error al conectar a la base de datos:", err));