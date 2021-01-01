import { Router } from 'express';
import { crearPedido } from 'app/controllers/pedido/crear';
import { ObtenerPedidos } from 'app/controllers/pedido/obtener-pedidos';
import { obtenerPedido } from 'app/controllers/pedido/obtener-pedido';
import { actualizarPedido } from 'app/controllers/pedido/actualizar';
import { ReportesPedido } from 'app/controllers/pedido/reportes';

export const pedidoRoutes = Router();

pedidoRoutes.post('/pedido', crearPedido);

pedidoRoutes.put('/pedido', actualizarPedido);

pedidoRoutes.get('/pedido', new ObtenerPedidos().exec);

pedidoRoutes.get('/pedido/:idPedido', obtenerPedido);

pedidoRoutes.get('/reporte-pedido', new ReportesPedido().exec);
