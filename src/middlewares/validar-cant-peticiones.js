import { validationResult } from "express-validator";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        msg: "Demasiadas Peticiones Desde Esta IP, Intente Más Tarde"
    }
});

export default limiter;