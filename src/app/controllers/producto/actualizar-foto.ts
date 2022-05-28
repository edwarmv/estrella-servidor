import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Producto } from 'app/entities/producto';
import { existsSync, unlinkSync } from 'fs';
import Jimp from 'jimp';

export const actualizarFotoProducto = async (req: Request, res: Response) => {
  const id = req.params.id;

  const file = req.file;

  if (!file) {
    return res.status(401).json({
      mensaje: 'No se subión ningún archivo'
    });
  }

  const filename = file.filename;

  const filePath = `./imagenes/fotos-productos/${filename}`;

  try {
    const producto = await getRepository(Producto).findOne(id);

    if (producto && producto.foto) {
      const fotoProducto = `./imagenes/fotos-productos/${producto.foto}`;

      if (existsSync(fotoProducto)) {
        unlinkSync(fotoProducto);
      }
    }

    (await Jimp.read(filePath)).resize(400, Jimp.AUTO).write(filePath);

    await getRepository(Producto).update(id, { foto: filename });

    res.status(201).json({ mensaje: 'Foto actualizada correctamente' });

  } catch(error) {
    try {
      unlinkSync(filePath);
    } catch(fsError) {
      return res.status(500).json(fsError);
    }

    res.status(500).json(error);
  }
};
