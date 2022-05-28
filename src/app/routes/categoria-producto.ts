import { Router } from 'express';
import { obtenerCategoriasProductos } from 'app/controllers/categoria-producto/obtener-categorias-productos';
import { crearCategoriaProducto } from 'app/controllers/categoria-producto/crear';
import { verificarToken } from 'app/middlewares/verificarToken.middleware';
import { obtenerCategoriaProducto } from 'app/controllers/categoria-producto/obtener-categoria-producto';
import { actualizarCategoriaProducto } from 'app/controllers/categoria-producto/actualizar';
import { borrarCategoriaProducto } from 'app/controllers/categoria-producto/borrar';

export const categoriaProductoRoutes = Router();

categoriaProductoRoutes.get(
  '/categoria-producto',
  verificarToken,
  obtenerCategoriasProductos
);

categoriaProductoRoutes.post(
  '/categoria-producto',
  verificarToken,
  crearCategoriaProducto
);

categoriaProductoRoutes.put(
  '/categoria-producto',
  verificarToken,
  actualizarCategoriaProducto
);

categoriaProductoRoutes.delete(
  '/categoria-producto/:idCategoriaProducto',
  verificarToken,
  borrarCategoriaProducto
)

categoriaProductoRoutes.get(
  '/categoria-producto/:idCategoriaProducto',
  verificarToken,
  obtenerCategoriaProducto
);
