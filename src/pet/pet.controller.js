import User from "../users/user.model.js";
import Pet from "../pet/pet.model.js";

const obtenerUsuarioPorEmail = async (email) => {
    const usuario = await User.findOne({ email });
    if (!usuario) {
        throw new Error("Propietario No Encontrado");
    }
    return usuario;
};

const obtenerMascotaPorId = async (id) => {
    const mascota = await Pet.findById(id);
    if (!mascota) {
        throw new Error("Mascota No Encontrada");
    }
    return mascota;
};

export const savePet = async (req, res) => {
    try {
        const { name, description, age, type, email } = req.body;

        const usuario = await obtenerUsuarioPorEmail(email);

        const nuevaMascota = new Pet({
            name,
            description,
            age,
            type: type ? type.toUpperCase() : "OTRO",
            keeper: usuario._id,
            status: true
        });

        await nuevaMascota.save();

        return res.status(200).json({
            success: true,
            pet: nuevaMascota
        });
    } catch (error) {
        console.error("Error al guardar la mascota:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error al guardar la mascota"
        });
    }
};

export const getPets = async (req, res) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [pets, total] = await Promise.all([
            Pet.find(query).skip(Number(desde)).limit(Number(limite)),
            Pet.countDocuments(query)
        ]);

        const petsConPropietario = await Promise.all(
            pets.map(async (pet) => {
                const owner = await User.findById(pet.keeper);
                return {
                    ...pet.toObject(),
                    keeper: owner ? owner.nombre : "Propietario No Encontrado"
                };
            })
        );

        return res.status(200).json({
            success: true,
            total,
            pets: petsConPropietario
        });
    } catch (error) {
        console.error("Error al obtener mascotas:", error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener mascotas",
            error
        });
    }
};

export const searchPet = async (req, res) => {
    try {
        const { id } = req.params;
        const mascota = await obtenerMascotaPorId(id);

        const owner = await User.findById(mascota.keeper);

        return res.status(200).json({
            success: true,
            pet: {
                ...mascota.toObject(),
                keeper: owner ? owner.nombre : "Propietario No Encontrado"
            }
        });
    } catch (error) {
        console.error("Error al buscar la mascota:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error al buscar la mascota"
        });
    }
};

export const deletePet = async (req, res) => {
    try {
        const { id } = req.params;

        await Pet.findByIdAndUpdate(id, { status: false });

        return res.status(200).json({
            success: true,
            message: "Mascota Eliminada Exitosamente"
        });
    } catch (error) {
        console.error("Error al desactivar la mascota:", error);
        return res.status(500).json({
            success: false,
            message: "Error al desactivar la mascota",
            error
        });
    }
};

export const updatePet = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, keeper, ...data } = req.body;

        const mascotaActualizada = await Pet.findByIdAndUpdate(id, data, { new: true });

        if (!mascotaActualizada) {
            return res.status(404).json({
                success: false,
                message: "Mascota No Encontrada"
            });
        }

        return res.status(200).json({
            success: true,
            msg: "Mascota Actualizada!",
            pet: mascotaActualizada
        });
    } catch (error) {
        console.error("Error al actualizar la mascota:", error);
        return res.status(500).json({
            success: false,
            msg: "Error al actualizar la mascota",
            error
        });
    }
};
