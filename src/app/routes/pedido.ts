import { Router } from 'express';
import { crearPedido } from 'app/controllers/pedido/crear';
import { ObtenerPedidos } from 'app/controllers/pedido/obtener-pedidos';
import { obtenerPedido } from 'app/controllers/pedido/obtener-pedido';
import { actualizarPedido } from 'app/controllers/pedido/actualizar';
import { ReportesPedido } from 'app/controllers/pedido/reportes';
import { pedidosFacturados } from 'app/controllers/pedido/pedidos-facturados';
import { asignarRepartidor } from 'app/controllers/pedido/asignar-repartidor';
import { CrearFacturaPedido } from 'app/controllers/pedido/crear-factura-pedido';
import { anularFacturaPedido } from 'app/controllers/pedido/anular-factura';

export const pedidoRoutes = Router();

pedidoRoutes.post('/pedido', crearPedido);

pedidoRoutes.put('/pedido', actualizarPedido);

pedidoRoutes.get('/pedido', new ObtenerPedidos().exec);

pedidoRoutes.post('/pedido/repartidor', asignarRepartidor);

pedidoRoutes.get('/pedido/reporte', new ReportesPedido().exec);

pedidoRoutes.get('/pedido/factura', pedidosFacturados);

pedidoRoutes.get('/pedido/factura/:idPedido', new CrearFacturaPedido().exec);

pedidoRoutes.get('/pedido/factura/anular/:idPedido', anularFacturaPedido);

pedidoRoutes.get('/pedido/:idPedido', obtenerPedido);
