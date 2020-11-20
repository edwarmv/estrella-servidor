import { Router } from 'express';
import { obtenerMenus } from 'controllers/menu/obtener-menus';
import { borrarMenu } from 'controllers/menu/borrar';
import { obtenerMenu } from 'controllers/menu/obtener-menu';
import { crearMenu } from 'controllers/menu/crear';
import { actualizarMenu } from 'controllers/menu/actualizar';
import { asignarSubmenu } from 'controllers/menu/asignar-submenu';
import { desasignarSubmenu } from 'controllers/menu/desasignar-submenu';

export const menuRoutes = Router();

menuRoutes.get('/menu', obtenerMenus);

menuRoutes.get('/menu/:idMenu', obtenerMenu);

menuRoutes.post('/menu', crearMenu);

menuRoutes.put('/menu/:idMenu', actualizarMenu);

menuRoutes.delete('/menu/:idMenu', borrarMenu);

menuRoutes.put('/menu-submenu/:idMenu', asignarSubmenu);

menuRoutes.delete('/menu-submenu/:idMenu/:idSubmenu', desasignarSubmenu);
