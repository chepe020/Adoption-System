import { response, request } from "express";
import { hash } from "argon2";
import User from "./user.model.js";

export const getUsers = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query).skip(Number(desde)).limit(Number(limite))
        ]);

        return res.status(200).json({
            success: true,
            total,
            users
        });
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener usuarios",
            error
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario No Encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener usuario",
            error
        });
    }
};

export const updateUser = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, password, email, ...data } = req.body;

        if (password) {
            data.password = await hash(password);
        }

        const user = await User.findByIdAndUpdate(id, data, { new: true });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario No Encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Usuario Actualizado",
            user
        });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        return res.status(500).json({
            success: false,
            message: "Error al actualizar usuario",
            error
        });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "La contraseña no puede estar vacía"
            });
        }

        const encryptedPassword = await hash(password);
        const user = await User.findByIdAndUpdate(id, { password: encryptedPassword }, { new: true });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario No Encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Contraseña actualizada correctamente",
            user
        });
    } catch (error) {
        console.error("Error al actualizar contraseña:", error);
        return res.status(500).json({
            success: false,
            message: "Error al actualizar la contraseña",
            error
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { estado: false }, { new: true });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario No Encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Usuario desactivado exitosamente",
            user
        });
    } catch (error) {
        console.error("Error al desactivar usuario:", error);
        return res.status(500).json({
            success: false,
            message: "Error al desactivar usuario",
            error
        });
    }
};
