import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { RolMenu } from 'app/entities/rol-menu';
import { Menu } from 'app/entities/menu';

export class ObtenerMenusController {
  async obtenerMenus(req: Request, res: Response) {
    const idRol = req.params.idRol;

    try {
      const rolMenu = await getRepository(RolMenu)
      .createQueryBuilder('rolMenu')
      .innerJoinAndSelect('rolMenu.menu', 'menu')
      .innerJoinAndSelect('menu.submenus', 'submenus')
      .where('rolMenu.rol.id = :idRol', { idRol })
      .orderBy('menu.nombre', 'ASC')
      .addOrderBy('submenus.nombre', 'ASC')
      .getMany();

      const menus: Menu[] = rolMenu.map(data => data.menu);

      res.json(menus);
    } catch(error) {
      res.status(500).json(error);
    }
  }
}
