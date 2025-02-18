import { Router } from "express";
import { check } from "express-validator";
import {savePet, getPets, searchPet, deletePet, updatePet} from "./pet.controller.js";
import {validarCampos} from "../middlewares/validar-campos.js";
import {validarJWT} from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        check("email", "Este No Es Un Correo Valido").not().isEmpty(),
        validarCampos
    ],
    savePet
)

router.get("/", getPets)

router.get(
    "/:id",
    [
        validarJWT,
        check("id", "No Es Un ID Valido").isMongoId(),
        validarCampos
    ],
    searchPet
)

router.put(
    "/:id",
    [
        validarJWT,
        validarCampos
    ],
    updatePet
)


router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "No Es Un ID Valido").isMongoId(),
        validarCampos
    ],
    deletePet
)

export default router;