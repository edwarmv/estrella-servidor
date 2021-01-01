import { Router } from 'express';
import { crearProducto } from 'app/controllers/producto/crear';
import { body } from 'express-validator';
import { actualizarProducto } from 'app/controllers/producto/actualizar';
import { borrarProducto } from 'app/controllers/producto/borrar';
import { obtenerProductos } from 'app/controllers/producto/obtener-productos';
import { obtenerProducto } from 'app/controllers/producto/obtener-producto';
import { actualizarFotoProducto } from 'app/controllers/producto/actualizar-foto';
import { subirFotoProductoMiddleware } from 'app/middlewares/subir-foto-producto';
import { obtenerFotoProducto } from 'app/controllers/producto/obtener-foto';

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
