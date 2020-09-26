import express from 'express';
import { usuarioRoutes } from './usuario';
import { rolRoutes } from './rol';
import { autentificacionRoutes } from './autentificacion';
import { rolUsuarioRoutes } from './rol-usuario';
import { productoRoutes } from './producto';
import { clienteRoutes } from './cliente';

export const routes = express.Router();

routes.use(autentificacionRoutes);
routes.use(usuarioRoutes);
routes.use(rolRoutes);
routes.use(rolUsuarioRoutes);
routes.use(productoRoutes);
routes.use(clienteRoutes);
