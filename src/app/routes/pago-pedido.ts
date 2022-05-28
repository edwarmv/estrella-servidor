import { Router } from "express";
import { borrarPagoPedido } from "app/controllers/pedido/pago/borrar";
import { registrarPagoPedido } from "app/controllers/pedido/pago/registrar";
import { obtenerPagosPedido } from "app/controllers/pedido/pago/obtener-pagos";
import { actualizarPagoPedido } from "app/controllers/pedido/pago/actualizar";
import { verificarToken } from "app/middlewares/verificarToken.middleware";

export const pagoPedidoRoutes = Router();

pagoPedidoRoutes.post('/pago-pedido', verificarToken, registrarPagoPedido);
pagoPedidoRoutes.put('/pago-pedido', verificarToken, actualizarPagoPedido);
pagoPedidoRoutes.get('/pago-pedido/:idPedido', verificarToken, obtenerPagosPedido);
pagoPedidoRoutes.delete('/pago-pedido/:idPedido/:idPagoPedido', verificarToken, borrarPagoPedido);
