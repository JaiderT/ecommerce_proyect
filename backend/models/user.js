import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    nombre: {type: String, required: true},
    telefono: {type: Number, required: true, minlength: 12},
    email: {type: String, required: true, unique:true},
    password: {type: String, required: true},
});
//forzar que guarde en user
const user = mongoose.model("user", userSchema, "user");
export default user;