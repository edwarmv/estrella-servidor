import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { unlinkSync } from 'fs';
import { Producto } from 'app/entities/producto';
import { getRepository } from 'typeorm';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './imagenes/fotos-productos');
  },

  filename: (req, file, cb) => {
    const filename = `${Date.now()}.${file.originalname.split('.').slice(-1)[0]}`;

    req.on('aborted',  () => {
      unlinkSync(`./imagenes/fotos-productos/${filename}`);
    });

    cb( null, filename);
  }
});

export const subirFotoProductoMiddleware = [

  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    console.log(id);

    try {
      const producto = await getRepository(Producto).findOne(id);

      if (!producto) {
        const error = new Error('Producto no encontrado');

        next(error);
      } else {
        next();
      }
    } catch(error) {
      next(error);
    }

  },
  multer(
    {
      storage,
      fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          cb(new Error('Por favor suba solo fotos JPG, JPEG o PNG'));
        }

        cb(null, true);
      }
    }
  ).single('foto-producto'),

  (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;

    if (!file) {
      const error = new Error('Por favor suba una foto');
      return next(error);
    }

    next();
  },

  (error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(400).json({
      mensaje: error.message
    });
  }

];
