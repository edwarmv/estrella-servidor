import { Router } from 'express';
import { obtenerSubmenus } from 'controllers/submenu/obtener-submenus';
import { submenusNoAsignados } from 'controllers/submenu/submenus-no-asignados';
import { borrarSubmenu } from 'controllers/submenu/borrar';
import { obtenerSubmenu } from 'controllers/submenu/obtener-submenu';
import { crearSubmenu } from 'controllers/submenu/crear';
import { actualizarSubmenu } from 'controllers/submenu/actualizar';

export const submenuRoutes = Router();

submenuRoutes.get('/submenu', obtenerSubmenus);

submenuRoutes.get('/submenu/:idSubmenu', obtenerSubmenu);

submenuRoutes.post('/submenu', crearSubmenu);

submenuRoutes.put('/submenu/:idSubmenu', actualizarSubmenu);

submenuRoutes.delete('/submenu/:idSubmenu', borrarSubmenu);

submenuRoutes.get('/submenus-no-asignados', submenusNoAsignados);
