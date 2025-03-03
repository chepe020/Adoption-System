import multer from "multer";
import { dirname, extname, join } from "path";
import { fileURLToPath } from "url";

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const MIMETYPES = ["image/jpeg", "image/png", "image/jpg"];
const MAX_SIZE = 10 * 1024 * 1024;

const diskStorageConfig = (destinationPath) => ({
    destination: (req, file, cb) => {
        const fullPath = join(CURRENT_DIR, destinationPath);
        req.filePath = fullPath;
        cb(null, fullPath);
    },
    filename: (req, file, cb) => {
        const fileExtension = extname(file.originalname);
        const fileName = file.originalname.replace(fileExtension, "");
        cb(null, `${fileName}-${Date.now()}${fileExtension}`);
    }
});

const createMulterConfig = (destinationPath) => 
    multer({
        storage: multer.diskStorage(diskStorageConfig(destinationPath)),
        fileFilter: (req, file, cb) => {
            if (MIMETYPES.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error(`Solo se permiten archivos con los siguientes tipos MIME: ${MIMETYPES.join(", ")}`));
            }
        },
        limits: { fileSize: MAX_SIZE }
    });

export const uploadProfilePicture = createMulterConfig("../public/uploads/profile-picture");
export const uploadPetPicture = createMulterConfig("../public/uploads/pet-picture");
