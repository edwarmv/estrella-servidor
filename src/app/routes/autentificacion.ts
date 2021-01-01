import { Router } from 'express';
import { body } from 'express-validator';

import { iniciarSesion } from 'app/controllers/autentificacion/iniciar-sesion';
import {
  verificarUsuario
} from 'app/controllers/autentificacion/verificar-usuario';
import { reenviarCorreoVerificacion } from 'app/controllers/autentificacion/reenviar-correo-verificacion';

export const autentificacionRoutes = Router();

autentificacionRoutes.post('/iniciar-sesion', [
  body('correoElectronico').isEmail(),
  body('password').isLength({ min: 8 })
], iniciarSesion);

autentificacionRoutes.get('/verificar-usuario/:token', verificarUsuario);

autentificacionRoutes.get(
  '/reenviar-correo-verificacion/:id',
  reenviarCorreoVerificacion
);
