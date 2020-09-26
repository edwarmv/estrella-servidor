import { Router } from 'express';

import { body } from 'express-validator';
import { verificarToken } from '../middlewares/verificarToken.middleware';
import { crearUsuario } from 'controllers/usuario/crear';
import { obtenerUsuarios } from 'controllers/usuario/obtener-usuarios';
import { obtenerUsuario } from 'controllers/usuario/obtener-usuario';
import { actualizarUsuario } from 'controllers/usuario/actualizar';
import { borrarUsuario } from 'controllers/usuario/borrar';
import { subirFotoUsuarioMiddleware } from 'middlewares/subir-foto-usuario';
import { subirFotoUsuario } from 'controllers/usuario/subir-foto';
import { obtenerFotoUsuario } from 'controllers/usuario/obtener-foto';

export const usuarioRoutes = Router();

usuarioRoutes.get('/usuario', obtenerUsuarios);

usuarioRoutes.get('/usuario/:id', obtenerUsuario);

usuarioRoutes.post('/usuario', [
  body('nombres').notEmpty(),
  body('apellidos').notEmpty(),
  body('correoElectronico').isEmail(),
  body('password').isLength({ min: 8 })
], crearUsuario);

usuarioRoutes.put('/usuario/:id', [
  // verificarToken,
], actualizarUsuario);

usuarioRoutes.delete('/usuario/:id', borrarUsuario);

usuarioRoutes.post('/foto-usuario/:idUsuario',
                   subirFotoUsuarioMiddleware,
                   subirFotoUsuario);


usuarioRoutes.get('/foto-usuario/:nombreImagen', obtenerFotoUsuario);

// usuarioRoutes.use((error, req, res, next) => {
    // res.json(error);
// });
