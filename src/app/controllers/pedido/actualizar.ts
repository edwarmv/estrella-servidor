import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { Pedido, EstadoPedido } from 'app/entities/pedido';
import { DetallePedido } from 'app/entities/detalle-pedido';

export const actualizarPedido = async (req: Request, res: Response) => {
  const pedido: Pedido = req.body;

  try {
    const pedidoDB = await getRepository(Pedido)
     .findOne(
       pedido.id,
       { relations: [ 'detallesPedidos', 'cliente', 'factura' ] }
     );

    if (!pedidoDB) {
      return res.status(401).json({
        mensaje: 'El pedido no se encuentra registrado'
      });
    }

    if (pedidoDB.estado === EstadoPedido.COMPLETADO) {
      return res.status(401).json({
        mensaje: `El pedido ya ha sido completado, no se permiten modificaciones`
      });
    }

    const a = pedido.detallesPedidos;
    const aIDs = pedido.detallesPedidos
      .map(detallePedido => detallePedido.id);

    const b = pedidoDB.detallesPedidos;
    const bIDs = pedidoDB.detallesPedidos
      .map(detallePedido => detallePedido.id);

    // diferencia b-a
    const detallesEliminados = b.filter(detallePedido => {
      return aIDs.indexOf(detallePedido.id) === -1;
    });

    // diferencia a-b
    let nuevosDetalles = a.filter(detallePedido => {
      return bIDs.indexOf(detallePedido.id) === -1;
    });

    // interserccion a b
    const detallesActualizados = a.filter(detalle => {
      return bIDs.indexOf(detalle.id) > -1;
    });

    await getConnection().transaction(async transaction => {
      if (detallesEliminados.length > 0) {
        await transaction.delete(DetallePedido, detallesEliminados);
      }

      // primero creamos un registro en la tabla detalles_pedidos
      nuevosDetalles = await transaction
      .save(DetallePedido, nuevosDetalles);

      // agregamos los nuevos detalles al pedido
      await transaction.createQueryBuilder()
      .relation(Pedido, 'detallesPedidos')
      .of(pedido)
      .add(nuevosDetalles);

      detallesActualizados.forEach(async detalle => {
        await transaction.update(DetallePedido, detalle.id, {
          cantidad: detalle.cantidad
        });
      });

      // actulizamos el cliente del pedido si es necesario
      if (pedido.cliente.id !== pedidoDB.cliente.id) {
        await transaction.createQueryBuilder()
        .relation(Pedido, 'cliente')
        .of(pedido)
        .set(pedido.cliente);
      }

      await transaction.update(Pedido, pedido.id, {
        fechaEntrega: pedido.fechaEntrega,
        conServicioEntrega: pedido.conServicioEntrega,
        direccionEntrega: pedido.direccionEntrega,
        coordenadasDireccionEntrega: pedido.conServicioEntrega ?
          pedido.coordenadasDireccionEntrega : undefined,
        estado: pedido.estado,
      });
    });

    res.json({ mensaje: 'Pedido actualizado' });
  } catch(error) {
    res.status(500).json({ mensaje: error.message });
  }
};
