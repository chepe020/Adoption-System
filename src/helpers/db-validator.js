import Role from '../role/role.model.js';
import Usuario from '../users/user.model.js';

const verificarExistencia = async (modelo, criterio, mensajeError) => {
    const existe = await modelo.findOne(criterio);
    if (!existe) {
        throw new Error(mensajeError);
    }
};

export const esRoleValido = async (role = "") => {
    await verificarExistencia(Role, { role }, `El Rol ${role} No Existe Dentro De La Base De Datos`);
};

export const existenteEmail = async (correo = '') => {
    const existe = await Usuario.findOne({ correo });
    if (existe) {
        throw new Error(`El Correo ${correo} Ya Existe En La Base De Datos`);
    }
};

export const existeUsuarioById = async (id = "") => {
    const existe = await Usuario.findById(id);
    if (!existe) {
        throw new Error(`El Id ${id} no existe`);
    }
};