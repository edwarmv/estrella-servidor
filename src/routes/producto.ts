import { Router } from 'express';
import { crearProducto } from 'controllers/producto/crear';
import { body } from 'express-validator';
import { actualizarProducto } from 'controllers/producto/actualizar';
import { borrarProducto } from 'controllers/producto/borrar';
import { obtenerProductos } from 'controllers/producto/obtener-productos';
import { obtenerProducto } from 'controllers/producto/obtener-producto';
import { actualizarFotoProducto } from 'controllers/producto/actualizar-foto';
import { subirFotoProductoMiddleware } from 'middlewares/subir-foto-producto';
import { obtenerFotoProducto } from 'controllers/producto/obtener-foto';

export const productoRoutes = Router();

productoRoutes.post('/producto', [
 body('nombre').notEmpty(),
 body('precio').notEmpty(),
], crearProducto);

productoRoutes.put('/producto/:id', [
  body('nombre').notEmpty(),
  body('precio').notEmpty()
], actualizarProducto);

productoRoutes.delete('/producto/:id', borrarProducto);

productoRoutes.get('/producto', obtenerProductos);

productoRoutes.get('/producto/:id', obtenerProducto);

productoRoutes.post(
  '/foto-producto/:id',
  subirFotoProductoMiddleware,
  actualizarFotoProducto
);

productoRoutes.get('/foto-producto/:nombreImagen', obtenerFotoProducto);
