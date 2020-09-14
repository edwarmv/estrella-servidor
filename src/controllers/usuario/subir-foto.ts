import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Usuario } from 'entities/usuario';
import { unlinkSync, existsSync } from 'fs';
import Jimp from 'jimp';

export const subirFotoUsuario = async (req: Request, res: Response) => {
  const idUsuario = parseInt(req.params.idUsuario, 10);
  const file = req.file;
  const filename = file.filename;
  const filePath = `./imagenes/fotos-usuarios/${filename}`;

  try {
    const usuario = await getRepository(Usuario).findOne(idUsuario);

    if (usuario && usuario.fotoPerfil) {
      const fotoPerfil = `./imagenes/fotos-usuarios/${usuario.fotoPerfil}`;
      if (existsSync(fotoPerfil)) {
        unlinkSync(fotoPerfil);
      }
    }

    (await Jimp.read(filePath)).resize(180, Jimp.AUTO).write(filePath);

    await getRepository(Usuario).update( idUsuario , { fotoPerfil: filename });

  } catch(error) {

    try {
      unlinkSync(filePath);
    } catch(fsError) {
      return res.status(500).json(fsError);
    }

    return res.status(500).json(error);
  }

  res.status(201).json({
    mensaje: 'Foto actualizada correctamente'
  });

};


