import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { Pedido } from './pedido';
import { Producto } from './producto';

@Entity('detalles_pedidos')
export class DetallePedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'precio_unitario',
    type: 'numeric',
    precision: 4,
    scale: 2
  })
  precioUnitario: number;

  @Column('int2')
  cantidad: number;

  @ManyToOne(type => Pedido, pedido => pedido.detallesPedidos)
  @JoinColumn({ name: 'pedidos_id' })
  pedido: Pedido;

  @OneToOne(type => Producto)
  @JoinColumn({ name: 'productos_id' })
  producto: Producto;
}
