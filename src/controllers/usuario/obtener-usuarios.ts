import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Usuario } from 'entities/usuario';

export const obtenerUsuarios = async (req: Request, res: Response) => {
  const skip = req.query.skip || 0;
  const take = req.query.take || 5;

  const termino = req.query.termino || '';

  try {
    const [ usuarios, total ] = await getRepository(Usuario)
    .createQueryBuilder('usuario')
    .skip(skip as number)
    .take(take as number)
    .select([
      'usuario.id',
      'usuario.nombres',
      'usuario.apellidos',
      'usuario.nitCI',
      'usuario.telefonoFijo',
      'usuario.telefonoMovil',
      'usuario.direccionDomicilio',
      'usuario.coordenadasDireccionDomicilio',
      'usuario.correoElectronico',
      'usuario.cuentaVerificada',
    ])
    .orderBy('usuario.nombres', 'ASC')
    .addOrderBy('usuario.apellidos', 'ASC')
    .where(
      'LOWER(usuario.nombres) LIKE :nombres',
      { nombres: `%${(termino as string).toLowerCase()}%` }
    )
    .getManyAndCount();

    res.json({
      usuarios,
      total
    });
  } catch(error) {
    res.status(500).json(error);
  }
};

