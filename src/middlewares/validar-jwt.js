import jwt from "jsonwebtoken";
import Usuario from "../users/user.model.js";

const verificarToken = (token) => {
    try {
        return jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    } catch (e) {
        throw new Error("Token No Valido");
    }
};
export const validarJWT = async (req, res, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: "No Hay Token En La Peticion"
        });
    }
    try {
        const { uid } = verificarToken(token);
        const usuario = await Usuario.findById(uid);
        if (!usuario) {
            return res.status(401).json({
                msg: "Usuario No Existente En La Base De Datos"
            });
        }
        if (!usuario.estado) {
            return res.status(401).json({
                msg: "Token No Valido - Usuario Estado: Inactivo"
            });
        }
        req.usuario = usuario;
        next();
    } catch (e) {
        console.error(e);
        res.status(401).json({
            msg: "Token No Valido"
        });
    }
};
