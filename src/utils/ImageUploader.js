import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './src/Images');
  },

  filename: (req, file, cb) => {
    const id = uuidv4();
    const fileExtension = path.extname(file.originalname);
    cb(null, `${id}${fileExtension}`);
  },
});
