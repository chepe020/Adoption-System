import { hash, verify } from "argon2";
import Usuario from "../users/user.model.js";
import { generarJWT } from "../helpers/generate-jwt.js";

const validarUsuario = async (email, username) => {
    const usuario = await Usuario.findOne({ $or: [{ email }, { username }] });

    if (!usuario) {
        throw new Error("Credenciales Incorrectas, Correo o Usuario No Existente");
    }

    if (!usuario.estado) {
        throw new Error("El Usuario No Está Activo");
    }

    return usuario;
};

export const login = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        const usuario = await validarUsuario(email, username);

        const esPasswordValido = await verify(usuario.password, password);
        if (!esPasswordValido) {
            return res.status(400).json({ msg: "La Contraseña Es Incorrecta" });
        }

        const token = await generarJWT(usuario.id);

        return res.status(200).json({
            msg: "Inicio De Sesión Exitoso!",
            userDetails: {
                username: usuario.username,
                token,
                profile_picture: usuario.profile_picture
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

export const register = async (req, res) => {
    try {
        const { name, surname, username, email, phone, password, role } = req.body;
        const profile_picture = req.file ? req.file.filename : null;

        const passwordCifrada = await hash(password);

        const nuevoUsuario = await Usuario.create({
            name,
            surname,
            username,
            email,
            phone,
            password: passwordCifrada,
            role,
            profile_picture
        });

        return res.status(201).json({
            message: "User Registered Successfully",
            userDetails: {
                email: nuevoUsuario.email
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "User Registration Failed",
            error: error.message
        });
    }
};
