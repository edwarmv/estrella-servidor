import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Usuario } from 'app/entities/usuario';

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
      'usuario.nombre',
      'usuario.apellido',
      'usuario.nitCI',
      'usuario.telefonoFijo',
      'usuario.telefonoMovil',
      'usuario.direccionDomicilio',
      'usuario.coordenadasDireccionDomicilio',
      'usuario.correoElectronico',
      'usuario.cuentaVerificada',
      'usuario.esEmpleado',
      'usuario.estado',
    ])
    .orderBy('usuario.nombre', 'ASC')
    .addOrderBy('usuario.apellido', 'ASC')
    .where(
      'LOWER(usuario.nitCI) LIKE :nitCI',
      { nitCI: `%${(termino as string).toLowerCase()}%` }
    )
    .orWhere(
      'LOWER(usuario.nombre) LIKE :nombre',
      { nombre: `%${(termino as string).toLowerCase()}%` }
    )
    .orWhere(
      'LOWER(usuario.apellido) LIKE :apellido',
      { apellido: `%${(termino as string).toLowerCase()}%` }
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

