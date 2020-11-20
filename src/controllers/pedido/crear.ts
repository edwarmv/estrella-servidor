import { Request, Response } from 'express';
import { Cliente } from 'entities/cliente';
import { DetallePedido } from 'entities/detalle-pedido';
import { getConnection } from 'typeorm';
import { Pedido, EstadoPedido } from 'entities/pedido';
import { Usuario } from 'entities/usuario';
import { Producto } from 'entities/producto';

export const crearPedido  = async (req: Request, res: Response) => {
  const body: Pedido = req.body;
  try {
    await getConnection().transaction(async transaction => {
      const usuario = new Usuario();
      usuario.id = body.usuario.id;
      const cliente = new Cliente();
      cliente.id = body.cliente.id;

      let pedido = new Pedido();
      pedido.usuario = usuario;
      pedido.cliente = cliente;
      pedido.conServicioEntrega = body.conServicioEntrega;
      pedido.direccionEntrega = body.direccionEntrega;
      pedido.fechaEntrega = body.fechaEntrega;
      pedido.estado = EstadoPedido.PENDIENTE;

      pedido = await transaction.save<Pedido>(pedido);

      const detallesPedidos: DetallePedido[] = [];
      body.detallesPedidos.forEach(item => {
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

      res.json({ mensaje: 'Pedido registrado correctamente' });
    });
  } catch(error) {
   res.status(500).json(error);
  }
};
