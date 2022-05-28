import { Router } from 'express';
import { crearCategoriaProductoProducto } from 'app/controllers/categoria-producto-producto/crear';
import { verificarToken } from 'app/middlewares/verificarToken.middleware';
import { borrarCategoriaProductoProducto } from 'app/controllers/categoria-producto-producto/borrar';

export const categoriaProductoProductoRoutes = Router();

categoriaProductoProductoRoutes.post(
  '/categoria-producto-producto',
  verificarToken,
  crearCategoriaProductoProducto
);

categoriaProductoProductoRoutes.delete(
  '/categoria-producto-producto/:idCategoriaProducto/:idProducto',
  verificarToken,
  borrarCategoriaProductoProducto
);
