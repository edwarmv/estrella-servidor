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
import { ObtenerDetallesPedido } from 'app/controllers/pedido/obtener-detalles-pedido';
import { verificarToken } from 'app/middlewares/verificarToken.middleware';
import { cancelarPedido } from 'app/controllers/pedido/cancelar';
import { CrearNotaVentaPedido } from 'app/controllers/pedido/crear-nota-venta-pedido';

export const pedidoRoutes = Router();

pedidoRoutes.post('/pedido', verificarToken, crearPedido);

pedidoRoutes.put('/pedido', verificarToken, actualizarPedido);

pedidoRoutes.get('/pedido', verificarToken, new ObtenerPedidos().exec);

pedidoRoutes.post('/pedido/repartidor', verificarToken, asignarRepartidor);

pedidoRoutes.get('/pedido/reporte', verificarToken, new ReportesPedido().exec);

pedidoRoutes.get('/pedido/factura', verificarToken, pedidosFacturados);

pedidoRoutes.get(
  '/pedido/detallesPedido/:idPedido',
  verificarToken,
  ObtenerDetallesPedido
);

pedidoRoutes.post(
  '/pedido/factura/:idPedido',
  verificarToken,
  new CrearFacturaPedido().exec
);

pedidoRoutes.get(
  '/pedido/factura/:idPedido',
  verificarToken,
  new CrearFacturaPedido().generarFactura
);

pedidoRoutes.get(
  '/pedido/factura/anular/:idPedido',
  verificarToken,
  anularFacturaPedido
);

pedidoRoutes.get('/pedido/:idPedido', verificarToken, obtenerPedido);

pedidoRoutes.delete('/pedido/:idPedido', verificarToken, cancelarPedido);

pedidoRoutes.get(
  '/pedido-nota-venta/:idPedido',
  verificarToken,
  new CrearNotaVentaPedido().execute
);
