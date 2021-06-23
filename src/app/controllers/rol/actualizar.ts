import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { getRepository } from 'typeorm';
import { Rol } from 'app/entities/rol';
import { RolMenu } from 'app/entities/rol-menu';

export const actualizarRol = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { nombre, descripcion, rolesMenus }: Rol = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    await getRepository(Rol).update(id, { nombre, descripcion });

    const rolesMenusDB: RolMenu[] = await getRepository(RolMenu)
    .find({ relations: ['rol', 'menu'], where: { rol: { id }} });

    if (rolesMenus.length) {
      const menusIDs: number[] = rolesMenus.map(rolMenu => rolMenu.menu.id);

      const menusDBIDs: number[] = rolesMenusDB.map(rolMenuDB => rolMenuDB.menu.id);

      const menusEliminadosIDs: number[] = menusDBIDs.filter(menuDBID => {
        return menusIDs.indexOf(menuDBID) === -1;
      });

      const nuevosMenusIDs: number[] = menusIDs.filter(menuID => {
        return menusDBIDs.indexOf(menuID) === -1;
      });

      console.log({ menusEliminadosIDs, nuevosMenusIDs });

      menusEliminadosIDs.forEach(async menuEliminadoID => {
        await getRepository(RolMenu).delete({ menu: { id: menuEliminadoID }});
      });

      nuevosMenusIDs.forEach(async nuevoMenuID => {
        await getRepository(RolMenu).insert(
          { rol: { id: parseInt(id, 10) }, menu: { id: nuevoMenuID } }
        );
      });
    } else {
      rolesMenusDB.forEach(async rolMenuDB => {
        await getRepository(RolMenu).delete({ menu: { id: rolMenuDB.menu.id }});
      });
    }

    res.json({ mensaje: 'Rol actualizado' });
  } catch(error) {
    res.status(500).json(error);
  }
};
