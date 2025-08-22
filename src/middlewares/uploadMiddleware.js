import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Directorio base
const uploadDir = path.join(process.cwd(), 'uploads/avatars');

// Crear carpeta si no existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Nombre unico: userId + timestamp + ext
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}_${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato invalido. Solo JPG, PNG, WEBP.'), false);
  }
};

const upload = multer ({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } }); // 2MB Max

export default upload;
