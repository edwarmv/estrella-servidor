import { Router } from 'express';
import { verificarToken } from 'app/middlewares/verificarToken.middleware';
import { crearSucursal } from 'app/controllers/sucursal/crear';
import { actualizarSucursal } from 'app/controllers/sucursal/actualizar';
import { obtenerSucursal } from 'app/controllers/sucursal/obtener-sucursal';
import { obtenerSucursales } from 'app/controllers/sucursal/obtener-sucursales';

export const sucursalRoutes = Router();

sucursalRoutes.post('/sucursal', verificarToken, crearSucursal);

sucursalRoutes.put('/sucursal/:idSucursal', verificarToken, actualizarSucursal);

sucursalRoutes.get('/sucursal', verificarToken, obtenerSucursales);

sucursalRoutes.get('/sucursal/:idSucursal', verificarToken, obtenerSucursal);
