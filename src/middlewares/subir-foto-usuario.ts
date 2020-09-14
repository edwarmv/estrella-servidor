import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { unlinkSync } from 'fs';
import { Usuario } from 'entities/usuario';
import { getRepository } from 'typeorm';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './imagenes/fotos-usuarios');
  },

  filename: (req, file, cb) => {
    const filename = `${Date.now()}.${file.originalname.split('.').slice(-1)[0]}`;
    req.on('aborted',  () => {
      console.log('aborted');
      unlinkSync(`./imagenes/fotos-usuarios/${filename}`);
    });

    cb( null, filename);
  }
});

export const subirFotoUsuarioMiddleware = [

  async (req: Request, res: Response, next: NextFunction) => {
    const idUsuario = req.params.idUsuario;

    try {
      const usuario = await getRepository(Usuario).findOne(idUsuario);

      if (!usuario) {
        const error = new Error('Usuario no encontrado');
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
  ).single('foto-usuario'),

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
