import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { Cliente } from './cliente';
import { DetallePedido } from './detalle-pedido';
import { Usuario } from './usuario';
import { PedidoRepartidor } from './pedido-repartidor';

export enum EstadoPedido {
  PENDIENTE = 'pendiente',
  LISTO = 'listo',
  ENTREGADO = 'entregado',
  COMPLETADO = 'completado',
  CANCELADO = 'cancelado'
}

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro: Date;

  @Column('timestamp')
  fechaEntrega: Date;

  @Column({ type: 'boolean', name: 'con_servicio_entrega' })
  conServicioEntrega: boolean;

  @Column({ type: 'varchar', name: 'direccion_entrega' })
  direccionEntrega: string;

  @Column({ type: 'varchar', name: 'coordenadas_direccion_entrega' })
  coordenadasDireccionEntrega: string;

  @Column({ type: 'enum', enum: EstadoPedido, default: EstadoPedido.PENDIENTE })
  estado: EstadoPedido;

  @ManyToOne(() => Usuario, usuario => usuario.pedidos)
  @JoinColumn({ name: 'usuarios_id' })
  usuario: Usuario;

  @ManyToOne(() => Cliente, cliente => cliente.pedidos)
  @JoinColumn({ name: 'clientes_id' })
  cliente: Cliente;

  @OneToMany(
    () => PedidoRepartidor,
    pedidoRepartidor => pedidoRepartidor.pedido
  )
  pedidosRepartidores: PedidoRepartidor[];

  @OneToMany(() => DetallePedido, detallePedido => detallePedido.pedido)
  detallesPedidos: DetallePedido[];
}
