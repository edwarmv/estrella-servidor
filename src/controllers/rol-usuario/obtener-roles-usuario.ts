import { Request, Response } from 'express';
import { RolUsuario } from 'entities/rol-usuario';
import { getRepository } from 'typeorm';

export const obtenerRolesUsuario = async (req: Request, res: Response) => {
  const idUsuario = req.params.idUsuario;

  try {
    const rolesUsuario = await getRepository(RolUsuario)
    .createQueryBuilder('rolUsuario')
    .innerJoinAndSelect('rolUsuario.rol', 'rol')
    .where('rolUsuario.usuario.id = :idUsuario', { idUsuario })
    .orderBy('rol.nombre', 'ASC')
    .getMany();

    res.json(rolesUsuario);
  } catch(error) {
    res.status(500).json(error);
  }
};
