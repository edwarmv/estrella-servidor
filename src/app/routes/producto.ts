import { Router } from 'express';
import { crearProducto } from 'app/controllers/producto/crear';
import { actualizarProducto } from 'app/controllers/producto/actualizar';
import { borrarProducto } from 'app/controllers/producto/borrar';
import { obtenerProductos } from 'app/controllers/producto/obtener-productos';
import { obtenerProducto } from 'app/controllers/producto/obtener-producto';
import { actualizarFotoProducto } from 'app/controllers/producto/actualizar-foto';
import { subirFotoProductoMiddleware } from 'app/middlewares/subir-foto-producto';
import { obtenerFotoProducto } from 'app/controllers/producto/obtener-foto';
import { verificarToken } from 'app/middlewares/verificarToken.middleware';

export const productoRoutes = Router();

productoRoutes.post(
  '/producto',
  verificarToken,
  crearProducto
);

productoRoutes.put(
  '/producto/:id',
  verificarToken,
  actualizarProducto
);

productoRoutes.delete('/producto/:id', verificarToken, borrarProducto);

productoRoutes.get('/producto', verificarToken, obtenerProductos);

productoRoutes.get('/producto/:id', verificarToken, obtenerProducto);

productoRoutes.post(
  '/foto-producto/:id',
  [verificarToken, ...subirFotoProductoMiddleware],
  actualizarFotoProducto
);

productoRoutes.get(
  '/foto-producto/:nombreImagen',
  obtenerFotoProducto
);
