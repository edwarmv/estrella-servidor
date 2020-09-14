import { Router } from 'express';
import { body } from 'express-validator';
import { asignarRolUsuario } from 'controllers/rol-usuario/asignar-rol-usuario';
import { actualizarRolUsuario } from 'controllers/rol-usuario/actualizar-rol-usuario';
import { borrarRolUsuario } from 'controllers/rol-usuario/borrar-rol-usuario';
import { obtenerRolUsuario } from 'controllers/rol-usuario/obtener-rol-usuario';
import { obtenerRolesUsuario } from 'controllers/rol-usuario/obtener-roles-usuario';
import { obtenerRolPorDefecto } from 'controllers/rol-usuario/obtener-rol-por-defecto';

export const rolUsuarioRoutes = Router();

rolUsuarioRoutes.post('/rol-usuario/', [
  body('idRol').notEmpty(),
  body('idUsuario').notEmpty(),
  body('estado').notEmpty(),
  body('rolPorDefecto').notEmpty()
], asignarRolUsuario);

rolUsuarioRoutes.put('/rol-usuario/:idRol/:idUsuario', [
  body('idRol').notEmpty(),
  body('idUsuario').notEmpty(),
  body('estado').notEmpty(),
  body('rolPorDefecto').notEmpty()
], actualizarRolUsuario);

rolUsuarioRoutes.delete('/rol-usuario/:idRol/:idUsuario', borrarRolUsuario);

rolUsuarioRoutes.get('/rol-usuario/:idRol/:idUsuario', obtenerRolUsuario);

rolUsuarioRoutes.get('/rol-usuario/:idUsuario', obtenerRolesUsuario);

rolUsuarioRoutes.get('/rol-por-defecto/:idUsuario', obtenerRolPorDefecto);

