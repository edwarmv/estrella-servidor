import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Usuario } from 'app/entities/usuario';

export const obtenerUsuarios = async (req: Request, res: Response) => {
  const skip = req.query.skip || 0;
  const take = req.query.take || 5;
  const termino = req.query.termino || '';
  const rol = req.query.rol || '';

  try {
    const query = getRepository(Usuario)
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
    .leftJoinAndSelect('usuario.rolesUsuarios', 'rolesUsuarios')
    .leftJoinAndSelect('rolesUsuarios.rol', 'rol')
    .orderBy('usuario.nombre', 'ASC')
    .addOrderBy('usuario.apellido', 'ASC');

    if (termino) {
      query.where(
        'LOWER(usuario.nitCI || \' \' || usuario.nombre || \' \' || usuario.apellido) LIKE :termino',
        { termino: `%${(termino as string).toLowerCase()}%` }
      );
    }

    if (rol) {
      query.andWhere('LOWER(rol.nombre) LIKE :rol', { rol: `%${(rol as string).toLowerCase()}%`});
    }

    const [ usuarios, total ] = await query.getManyAndCount();

    res.json({
      usuarios,
      total
    });
  } catch(error) {
    res.status(500).json(error);
  }
};

