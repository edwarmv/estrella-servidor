import { Router } from 'express';
import { CrearFacturaPedido } from 'app/controllers/factura/crear-factura-pedido';
import { generarCodigoControl } from 'app/controllers/factura/generar-codigo-control';

export const facturaRoutes = Router();

facturaRoutes.get('/factura-pedido/:idPedido', new CrearFacturaPedido().exec);

facturaRoutes.post('/factura/codigo-control', generarCodigoControl);
