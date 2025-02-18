import { Router } from "express";
import { createDate } from "../date/date.controller.js"; 
import {validarJWT} from "../middlewares/validar-jwt.js";


const router = Router();

router.post("/",
    [validarJWT],
     createDate);

export default router;
