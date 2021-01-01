import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { RolUsuario } from 'app/entities/rol-usuario';
import { RolMenu } from 'app/entities/rol-menu';

export class ObtenerMenusRolPorDefecto {
  async exec(req: Request, res: Response) {
    const idUsuario = req.params.idUsuario;

    try {
      const rolUsuarioPorDefecto = await getRepository(RolUsuario)
      .findOne({
        where: {
          usuario: { id: Number.parseInt(idUsuario, 10) },
          rolPorDefecto: true
        },
        relations: ['rol']
      });

      if (rolUsuarioPorDefecto) {
        const menus = (await getRepository(RolMenu)
        .createQueryBuilder('rolMenu')
        .leftJoinAndSelect('rolMenu.menu', 'menu')
        .leftJoinAndSelect('menu.submenus', 'submenus')
        .orderBy('menu.nombre', 'ASC')
        .addOrderBy('submenus.nombre', 'ASC')
        .getMany()
        // .find({
          // where: { rol: { id: rolUsuarioPorDefecto.rol.id } },
          // relations: ['menu', 'menu.submenus'],
        // })
        ).map(rolMenu => rolMenu.menu);

        res.json(menus);
      } else {
        res.json([]);
      }
    } catch(error) {
      res.status(500).json(error);
    }
  }
}
