import express from 'express';
import { usuarioRoutes } from './usuario';
import { rolRoutes } from './rol';
import { autentificacionRoutes } from './autentificacion';
import { rolUsuarioRoutes } from './rol-usuario';
import { productoRoutes } from './producto';
import { clienteRoutes } from './cliente';
import { rolMenuRoutes } from './rol-menu';
import { pedidoRoutes } from './pedido';
import { menuRoutes } from './menu';
import { submenuRoutes } from './submenu';
import { facturaRoutes } from './factura';

export const routes = express.Router();

routes.use(autentificacionRoutes);
routes.use(usuarioRoutes);
routes.use(rolRoutes);
routes.use(rolUsuarioRoutes);
routes.use(productoRoutes);
routes.use(clienteRoutes);
routes.use(rolMenuRoutes);
routes.use(menuRoutes);
routes.use(submenuRoutes);
routes.use(pedidoRoutes);
routes.use(facturaRoutes);
