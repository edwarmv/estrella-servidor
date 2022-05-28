import { Router } from 'express';
import { verificarToken } from 'app/middlewares/verificarToken.middleware';
import { crearCaja } from 'app/controllers/caja/crear';
import { actualizarCaja } from 'app/controllers/caja/actualizar';
import { obtenerCajas } from 'app/controllers/caja/obtener-cajas';
import { obtenerCaja } from 'app/controllers/caja/obtener-caja';

export const cajaRoutes = Router();

cajaRoutes.post('/caja', verificarToken, crearCaja);

cajaRoutes.put('/caja/:idCaja', verificarToken, actualizarCaja);

cajaRoutes.get('/caja', verificarToken, obtenerCajas);

cajaRoutes.get('/caja/:idCaja', verificarToken, obtenerCaja);
