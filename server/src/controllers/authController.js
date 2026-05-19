import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function login(req,res){
    const {username,password} = req.body;

    const user = await User.findOne({username})

    if(!user){
        return res.status(400).send("Credenciales incorrectas")
    }

    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
        return res.status(400).send("Credenciales incorrectas")
    }

    const token = jwt.sign({id:user._id,username:user.username},process.env.JWT_SECRET);
    res.cookie("token",token,{httpOnly:true,secure:true,sameSite:"strict",expires:new Date(Date.now()+24*60*60*1000)});
    res.status(200).json({message:"Login exitoso"});
    console.log(res.cookies);


}

async function register(req,res){
    const {username,password,passwordRepeat} = req.body;

    if(password !== passwordRepeat){
        return res.status(400).json("Las contraseñas no coinciden")
    }
    const oldUser = await User.findOne({username})

    if(oldUser){
        return res.status(400).json("El usuario ya existe")
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const user = new User({
        username,
        password:hashedPassword
    })

    await user.save();
    res.status(201).json("Usuario creado");
    
}

async function logout(req,res){
    res.clearCookie("token");
    res.status(200).json({message:"Logout exitoso"});
}
export {
    login,
    register,
    logout
}