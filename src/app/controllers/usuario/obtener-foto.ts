import { Request, Response } from 'express';
import { existsSync } from 'fs';

export const obtenerFotoUsuario = async (req: Request, res: Response) => {
  const nombreImagen = req.params.nombreImagen;

  try {

    const path = `./imagenes/fotos-usuarios/${nombreImagen}`;
    const existeFoto: boolean = existsSync(path);
    if (existeFoto) {
      res.download(path);
    } else {
      const noImage = `./imagenes/no-profile-image.png`;
      res.download(noImage);
    }

  } catch(error) {
    res.status(500).json(error);
  }
};
