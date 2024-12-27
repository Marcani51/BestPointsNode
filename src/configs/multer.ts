import multer from "multer";
import path from "path";
import fs from "fs";
import { ExpressError } from "../utils/ExpressError";

// Ensure the directory exists
const uploadDir = path.join(__dirname, "../public/images/");
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Save images in the directory
    },
    filename: function (req, file, cb) {
        const uniqeSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqeSuffix + path.extname(file.originalname));
    },
});

export const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new ExpressError("Only images are allowed", 405));
        }
    },
});