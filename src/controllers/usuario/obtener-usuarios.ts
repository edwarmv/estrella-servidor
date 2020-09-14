import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Usuario } from 'entities/usuario';

export const obtenerUsuarios = async (req: Request, res: Response) => {
  const skip = req.query.skip || 0;
  const take = req.query.take || 5;

  try {
    const [ usuarios, total ] = await getRepository(Usuario).findAndCount({
      skip: skip as number,
      take: take as number,
      select: [
        'id',
        'nombres',
        'apellidos',
        'telefonoFijo',
        'telefonoMovil',
        'direccionDomicilio',
        'coordenadasDireccionDomicilio',
        'correoElectronico',
        'cuentaVerificada'
      ]
    });

    res.json({
      usuarios,
      total
    });
  } catch(error) {
    res.status(500).json(error);
  }
};

