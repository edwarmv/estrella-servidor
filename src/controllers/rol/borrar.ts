import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { Rol } from 'entities/rol';
import { RolUsuario } from 'entities/rol-usuario';

export const borrarRol = async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log('borrarRol');

  try {
    await getConnection().transaction(async transaction => {
      const rolUsuario = new RolUsuario();
      rolUsuario.rol = { id: parseInt(id, 10) } as Rol;

      const rolesUsuarios = await transaction.getRepository(RolUsuario)
      .find({ where: rolUsuario, relations: ['rol'] });

      rolesUsuarios.forEach(async item => {
        await transaction.delete(RolUsuario, item);
      });

      await transaction.delete(Rol, id);
    });

    res.json({ mensaje: 'Rol eliminado' });

  } catch(error) {
    res.status(500).json(error);
  }
};
