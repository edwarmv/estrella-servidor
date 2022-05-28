import { Router } from 'express';
import { crearMovimientoCaja } from 'app/controllers/movimiento-caja/crear';
import { obtenerMovimientosCajas } from 'app/controllers/movimiento-caja/obtener-movimientos-cajas';
import { verificarToken } from 'app/middlewares/verificarToken.middleware';

export const movimientoCajaRoutes = Router();

movimientoCajaRoutes.post('/movimiento-caja', verificarToken, crearMovimientoCaja);

movimientoCajaRoutes.get('/movimiento-caja', obtenerMovimientosCajas);
