import Date from "../date/date.model.js"; 
import Pet from "../pet/pet.model.js"; 
import User from "../users/user.model.js"; 

export const createDate = async (req, res) => {
    try {
        const { email, petId, date } = req.body;

        console.log("Cuerpo de la solicitud para la cita:", req.body); 

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Propietario No Encontrado"
            });
        }

        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(400).json({
                success: false,
                message: "Mascota No Encontrada"
            });
        }

        const newDate = new Date({
            owner: user._id,
            pet: pet._id,
            date: date,
            status: true
        });

        await newDate.save();

        res.status(200).json({
            success: true,
            date: newDate
        });
    } catch (error) {
        console.error("Error al guardar la cita:", error);
        res.status(500).json({
            success: false,
            message: "Error al guardar la cita",
            error
        });
    }
}
