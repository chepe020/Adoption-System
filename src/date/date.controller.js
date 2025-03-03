import Date from "../date/date.model.js"; 
import Pet from "../pet/pet.model.js"; 
import User from "../users/user.model.js"; 

const obtenerUsuarioPorEmail = async (email) => {
    const usuario = await User.findOne({ email });
    if (!usuario) {
        throw new Error("Propietario No Encontrado");
    }
    return usuario;
};

const obtenerMascotaPorId = async (petId) => {
    const mascota = await Pet.findById(petId);
    if (!mascota) {
        throw new Error("Mascota No Encontrada");
    }
    return mascota;
};

export const createDate = async (req, res) => {
    try {
        const { email, petId, date } = req.body;
        console.log("Cuerpo de la solicitud para la cita:", req.body); 

        const usuario = await obtenerUsuarioPorEmail(email);
        const mascota = await obtenerMascotaPorId(petId);

        const nuevaCita = new Date({
            owner: usuario._id,
            pet: mascota._id,
            date,
            status: true
        });

        await nuevaCita.save();

        return res.status(200).json({
            success: true,
            date: nuevaCita
        });
    } catch (error) {
        console.error("Error al guardar la cita:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error al guardar la cita"
        });
    }
};

