import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Pedido } from './pedido';
import { Usuario } from './usuario';

@Entity('pedidos_repartidores')
export class PedidoRepartidor {
  @ManyToOne(
    () => Pedido,
    pedido => pedido.pedidosRepartidores,
    { primary: true }
  )
  @JoinColumn({ name: 'pedidos_id' })
  pedido: Pedido;

  @ManyToOne(
    () => Usuario,
    usuario => usuario.pedidosRepartidores,
    { primary: true }
  )
  @JoinColumn({ name: 'usuarios_id' })
  usuario: Usuario;
}
