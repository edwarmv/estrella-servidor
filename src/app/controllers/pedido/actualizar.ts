import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { Pedido } from 'app/entities/pedido';
import { DetallePedido } from 'app/entities/detalle-pedido';
import { TablaLog, OperacionTablaLog } from 'app/entities/tabla-log';
import { TableNames } from 'app/entities/table-names.enum';
import { TokenUtil } from 'app/utils/token.util';

export const actualizarPedido = async (req: Request, res: Response) => {
  const pedido: Pedido = req.body;
  const tokenUtil = new TokenUtil();
  const idUsuario = tokenUtil.getTokenPayload(req).sub;

  try {
    const pedidoDB = await getRepository(Pedido).findOne(pedido.id, {
      relations: ['detallesPedidos', 'cliente', 'factura'],
    });

    if (!pedidoDB) {
      return res.status(401).json({
        mensaje: 'El pedido no se encuentra registrado',
      });
    }

    if (pedidoDB.cancelado) {
      return res.status(400).json({
        mensaje: 'Pedido cancelado, no se permiten modificaciones',
      });
    }

    if (pedidoDB.factura) {
      if (
        pedido.conServicioEntrega &&
        (!pedido.direccionEntrega && !pedido.coordenadasDireccionEntrega)
      ) {
        return res
          .status(400)
          .json({
            mensaje:
              'Si el pedido es con entrega a domicilio, al menos debe de establecer la dirección de entrega o la ubicación de google maps',
          });
      }
      for (const key in pedido) {
        if (key === 'id' && pedido[key]) {
          continue;
        }
        if (key === 'pedido' && pedido[key]) {
          continue;
        }
        if (key === 'fechaEntrega' && pedido[key]) {
          continue;
        }
        if (key === 'conServicioEntrega' && pedido[key]) {
          continue;
        }
        if (key === 'direccionEntrega' && pedido[key]) {
          continue;
        }
        if (key === 'coordenadasDireccionEntrega' && pedido[key]) {
          continue;
        }
        if (key === 'estado' && pedido[key]) {
          continue;
        }
        delete pedido[key];
      }
      await getRepository(Pedido).update(pedido.id, pedido);
      return res.json({ mensaje: `Pedido actualizado correctamente` });
    }

    let detallesEliminados: DetallePedido[] = [];
    let nuevosDetalles: DetallePedido[] = [];
    let detallesActualizados: DetallePedido[] = [];

    if (pedido.detallesPedidos) {
      const a = pedido.detallesPedidos;
      const aIDs = pedido.detallesPedidos.map(
        detallePedido => detallePedido.id
      );

      const b = pedidoDB.detallesPedidos;
      const bIDs = pedidoDB.detallesPedidos.map(
        detallePedido => detallePedido.id
      );

      // diferencia b-a
      detallesEliminados = b.filter(detallePedido => {
        return aIDs.indexOf(detallePedido.id) === -1;
      });

      // diferencia a-b
      nuevosDetalles = a.filter(detallePedido => {
        return bIDs.indexOf(detallePedido.id) === -1;
      });

      // interserccion a b
      detallesActualizados = a.filter(detalle => {
        return bIDs.indexOf(detalle.id) > -1;
      });
    }

    await getConnection().transaction(async transaction => {
      if (detallesEliminados.length > 0) {
        await transaction.delete(DetallePedido, detallesEliminados);
      }

      // primero creamos un registro en la tabla detalles_pedidos
      nuevosDetalles = await transaction.save(DetallePedido, nuevosDetalles);

      // agregamos los nuevos detalles al pedido
      await transaction
        .createQueryBuilder()
        .relation(Pedido, 'detallesPedidos')
        .of(pedido)
        .add(nuevosDetalles);

      detallesActualizados.forEach(async detalle => {
        await transaction.update(DetallePedido, detalle.id, {
          cantidad: detalle.cantidad,
        });
      });

      // actulizamos el cliente del pedido si es necesario
      if (pedido.cliente && pedido.cliente.id !== pedidoDB.cliente.id) {
        await transaction
          .createQueryBuilder()
          .relation(Pedido, 'cliente')
          .of(pedido)
          .set(pedido.cliente);
      }

      // actualizamos el pedido
      await transaction.update(Pedido, pedido.id, {
        fechaEntrega: pedido.fechaEntrega
          ? pedido.fechaEntrega
          : pedidoDB.fechaEntrega,
        conServicioEntrega: pedido.conServicioEntrega
          ? pedido.conServicioEntrega
          : pedidoDB.conServicioEntrega,
        direccionEntrega: pedido.conServicioEntrega
          ? pedido.direccionEntrega
          : pedidoDB.conServicioEntrega
          ? pedidoDB.direccionEntrega
          : undefined,
        coordenadasDireccionEntrega: pedido.conServicioEntrega
          ? pedido.coordenadasDireccionEntrega
          : pedidoDB.conServicioEntrega
          ? pedidoDB.coordenadasDireccionEntrega
          : undefined,
        estado: pedido.estado ? pedido.estado : pedidoDB.estado,
      });

      const pedidoActualizado = await transaction.findOne(Pedido, pedido.id);

      // registramos la operación en nuestra tabla log
      await transaction.insert<TablaLog<Pedido>>(TablaLog, {
        operacion: OperacionTablaLog.UPDATE,
        nombreTabla: TableNames.pedidos,
        usuario: { id: parseInt(idUsuario!) },
        antiguoValor: pedido,
        nuevoValor: pedidoActualizado,
      });
    }); // end transaction

    res.json({ mensaje: 'Pedido actualizado' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};
