import { Router } from 'express';

import { body } from 'express-validator';
import { verificarToken } from 'app/middlewares/verificarToken.middleware';
import { crearUsuario } from 'app/controllers/usuario/crear';
import { obtenerUsuarios } from 'app/controllers/usuario/obtener-usuarios';
import { obtenerUsuario } from 'app/controllers/usuario/obtener-usuario';
import { actualizarUsuario } from 'app/controllers/usuario/actualizar';
import { cambiarEstadoUsuario } from 'app/controllers/usuario/cambiar-estado';
import { subirFotoUsuarioMiddleware } from 'app/middlewares/subir-foto-usuario';
import { subirFotoUsuario } from 'app/controllers/usuario/subir-foto';
import { obtenerFotoUsuario } from 'app/controllers/usuario/obtener-foto';

export const usuarioRoutes = Router();

usuarioRoutes.get('/usuario', obtenerUsuarios);

usuarioRoutes.get('/usuario/:id', obtenerUsuario);

usuarioRoutes.post('/usuario', [
  body('nombre').notEmpty(),
  body('apellido').notEmpty(),
  body('correoElectronico').isEmail(),
  body('password').isLength({ min: 8 })
], crearUsuario);

usuarioRoutes.put('/usuario/:id', [
  // verificarToken,
], actualizarUsuario);

usuarioRoutes.delete('/usuario/:id', cambiarEstadoUsuario);

usuarioRoutes.post('/foto-usuario/:idUsuario',
                   subirFotoUsuarioMiddleware,
                   subirFotoUsuario);


usuarioRoutes.get('/foto-usuario/:nombreImagen', obtenerFotoUsuario);

// usuarioRoutes.use((error, req, res, next) => {
    // res.json(error);
// });
