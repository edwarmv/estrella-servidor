import { Router } from 'express';
import { obtenerSubmenus } from 'app/controllers/submenu/obtener-submenus';
import { submenusNoAsignados } from 'app/controllers/submenu/submenus-no-asignados';
import { borrarSubmenu } from 'app/controllers/submenu/borrar';
import { obtenerSubmenu } from 'app/controllers/submenu/obtener-submenu';
import { crearSubmenu } from 'app/controllers/submenu/crear';
import { actualizarSubmenu } from 'app/controllers/submenu/actualizar';

export const submenuRoutes = Router();

submenuRoutes.get('/submenu', obtenerSubmenus);

submenuRoutes.get('/submenu/:idSubmenu', obtenerSubmenu);

submenuRoutes.post('/submenu', crearSubmenu);

submenuRoutes.put('/submenu/:idSubmenu', actualizarSubmenu);

submenuRoutes.delete('/submenu/:idSubmenu', borrarSubmenu);

submenuRoutes.get('/submenus-no-asignados', submenusNoAsignados);
