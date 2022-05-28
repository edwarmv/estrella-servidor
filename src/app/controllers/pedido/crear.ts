import { Request, Response } from 'express';
import { Cliente } from 'app/entities/cliente';
import { DetallePedido } from 'app/entities/detalle-pedido';
import { getConnection } from 'typeorm';
import { Pedido } from 'app/entities/pedido';
import { Producto } from 'app/entities/producto';
import { TablaLog, OperacionTablaLog } from 'app/entities/tabla-log';
import { TableNames } from 'app/entities/table-names.enum';
import { TokenUtil } from 'app/utils/token.util';

export const crearPedido = async (req: Request, res: Response) => {
  const body: Pedido = req.body;
  const tokenUtil = new TokenUtil();
  const idUsuario = tokenUtil.getTokenPayload(req).sub;
  try {
    await getConnection().transaction(async (transaction) => {
      const cliente = new Cliente();
      cliente.id = body.cliente.id;

      let pedido = new Pedido();
      pedido.cliente = cliente;
      pedido.conServicioEntrega = body.conServicioEntrega;
      pedido.direccionEntrega = body.direccionEntrega;
      pedido.coordenadasDireccionEntrega = body.coordenadasDireccionEntrega;
      pedido.fechaEntrega = body.fechaEntrega;
      pedido.estado = pedido.estado;

      pedido = await transaction.save<Pedido>(pedido);

      const detallesPedidos: DetallePedido[] = [];
      body.detallesPedidos.forEach((item) => {
        const producto = new Producto();
        producto.id = item.producto.id;

        const detallePedido = new DetallePedido();
        detallePedido.producto = producto;
        detallePedido.precioUnitario = item.precioUnitario;
        detallePedido.cantidad = item.cantidad;
        detallePedido.pedido = pedido;

        detallesPedidos.push(detallePedido);
      });

      await transaction.save<DetallePedido>(detallesPedidos);

      await transaction.insert<TablaLog<Pedido>>(TablaLog, {
        operacion: OperacionTablaLog.INSERT,
        nombreTabla: TableNames.pedidos,
        usuario: { id: parseInt(idUsuario!) },
        nuevoValor: pedido,
      });

      res.status(201).json({
        mensaje: 'Pedido registrado correctamente',
        pedido,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
