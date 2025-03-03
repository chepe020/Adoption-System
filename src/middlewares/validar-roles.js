const verificarUsuario = (req, res) => {
    if (!req.usuario) {
        return res.status(500).json({
            success: false,
            msg: "Se quiere verificar un Rol Sin Validar El Token Antes"
        });
    }
    return null;
};

export const tieneRole = (...roles) => {
    return (req, res, next) => {
        const error = verificarUsuario(req, res);
        if (error) return error;

        if (!roles.includes(req.usuario.role)) {
            return res.status(401).json({
                success: false,
                msg: `Usuario No Autorizado, Posee Un Rol ${req.usuario.role}, los roles autorizados son ${roles.join(", ")}`
            });
        }

        next();
    };
};
