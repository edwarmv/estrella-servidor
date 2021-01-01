import { Request, Response } from 'express';
import { RolUsuario } from 'app/entities/rol-usuario';
import { getRepository } from 'typeorm';

export const obtenerRolUsuario = async (req: Request, res: Response) => {
  const idRol = req.params.idRol;
  const idUsuario = req.params.idUsuario;

  try {
    const rolUsuario = await getRepository(RolUsuario)
    .createQueryBuilder('rolUsuario')
    .innerJoinAndSelect('rolUsuario.rol', 'rol')
    .where(
      'rol.id = :idRol AND rolUsuario.usuario.id = :idUsuario',
      { idRol, idUsuario }
    ).getOne();

    if (rolUsuario) {
      res.json(rolUsuario.rol);
    } else {
      res.status(404).json({ error: 'Rol no encontrado' });
    }

  } catch(error) {
    res.status(500).json(error);
  }
};
