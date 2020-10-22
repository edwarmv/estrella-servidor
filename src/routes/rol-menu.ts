import { Router } from 'express';
import { ObtenerMenusController } from 'controllers/rol-menu/obtener-menus';
import { ObtenerMenusRolPorDefecto } from 'controllers/rol-menu/obtener-menus-rol-por-defecto';

export const rolMenuRoutes = Router();

const obtenerMenusController = new ObtenerMenusController();
rolMenuRoutes.get(
  '/rol-menu/:idRol',
  obtenerMenusController.obtenerMenus
);

const obtenerMenusRolPorDefecto = new ObtenerMenusRolPorDefecto().exec;
rolMenuRoutes.get(
  '/menus-rol-por-defecto/:idUsuario',
  obtenerMenusRolPorDefecto
);
