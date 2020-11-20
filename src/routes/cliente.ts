import { Router } from 'express';
import { crearCliente } from 'controllers/cliente/crear';
import { body } from 'express-validator';
import { actualizarCliente } from 'controllers/cliente/actualizar';
import { borrarCliente } from 'controllers/cliente/borrar';
import { obtenerClientes } from 'controllers/cliente/obtener-clientes';
import { obtenerCliente } from 'controllers/cliente/obtener-cliente';

export const clienteRoutes = Router();

clienteRoutes.post('/cliente', [
  body('nombre').notEmpty(),
  body('apellido').notEmpty(),
  body('nitCI').notEmpty(),
], crearCliente);

clienteRoutes.put('/cliente/:id', [
  body('nombre').notEmpty(),
  body('apellido').notEmpty(),
  body('nitCI').notEmpty(),
], actualizarCliente);

clienteRoutes.delete('/cliente/:id', borrarCliente);

clienteRoutes.get('/cliente', obtenerClientes);

clienteRoutes.get('/cliente/:id', obtenerCliente);
