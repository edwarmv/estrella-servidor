import { Router } from 'express';
import { CrearFacturaPedido } from 'app/controllers/factura/crear-factura-pedido';

export const facturaRoutes = Router();

facturaRoutes.get('/factura-pedido/:idPedido', new CrearFacturaPedido().exec);
