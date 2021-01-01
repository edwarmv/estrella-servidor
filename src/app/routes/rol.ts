import { Router } from 'express';
import { body } from 'express-validator';
import { verificarToken } from 'app/middlewares/verificarToken.middleware';
import { crearRol } from 'app/controllers/rol/crear';
import { actualizarRol } from 'app/controllers/rol/actualizar';
import { borrarRol } from 'app/controllers/rol/borrar';
import { obtenerRoles } from 'app/controllers/rol/obtener-roles';
import { obtenerRol } from 'app/controllers/rol/obtener-rol';

export const rolRoutes = Router();

rolRoutes.post('/rol', [
  body('nombre').notEmpty(),
  // verificarToken
], crearRol);

rolRoutes.put('/rol/:id', [
  body('nombre').notEmpty(),
  body('descripcion').notEmpty(),
  // verificarToken
], actualizarRol);

rolRoutes.delete('/rol/:id', borrarRol);

rolRoutes.get('/rol', obtenerRoles);

rolRoutes.get('/rol/:id', obtenerRol);
