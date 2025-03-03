import fs from "fs/promises";
import { join } from "path";

const eliminarArchivo = async (filePath) => {
    try {
        await fs.unlink(filePath);
    } catch (error) {
        console.error("Error al eliminar el archivo: ", error);
    }
};

export const deleteFileOnError = async (err, req, res, next) => {
    if (req.file && req.filePath) {
        const filePath = join(req.filePath, req.file.filename);
        await eliminarArchivo(filePath);
    }
    
    const statusCode = err.status === 400 || err.errors ? 400 : 500;
    return res.status(statusCode).json({
        success: false,
        error: err.errors || err.message
    });
};
