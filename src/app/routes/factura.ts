import { Router } from 'express';
import { generarCodigoControl } from 'app/controllers/factura/generar-codigo-control';

export const facturaRoutes = Router();

facturaRoutes.post('/factura/codigo-control', generarCodigoControl);
