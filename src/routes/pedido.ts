import { Router } from 'express';
import { crearPedido } from 'controllers/pedido/crear';
import { obtenerPedidos } from 'controllers/pedido/obtener-pedidos';

export const pedidoRoutes = Router();

pedidoRoutes.post('/pedido', crearPedido);

pedidoRoutes.get('/pedido', obtenerPedidos);
