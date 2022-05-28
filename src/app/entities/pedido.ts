import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Cliente } from './cliente';
import { DetallePedido } from './detalle-pedido';
import { Usuario } from './usuario';
import { Factura } from './factura';
import { PagoPedido } from './pago-pedido';

export enum EstadoPedido {
  PENDIENTE = 'pendiente',
  LISTO = 'listo',
  ENTREGADO = 'entregado',
  COMPLETADO = 'completado',
}

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro: Date;

  @Column({ type: 'timestamp', name: 'fecha_entrega' })
  fechaEntrega: Date;

  @Column({
    type: 'boolean',
    name: 'con_servicio_entrega',
    default: false,
  })
  conServicioEntrega: boolean;

  @Column({
    type: 'varchar',
    name: 'direccion_entrega',
    nullable: true,
  })
  direccionEntrega: string;

  @Column({
    type: 'jsonb',
    name: 'coordenadas_direccion_entrega',
    nullable: true,
  })
  coordenadasDireccionEntrega: { lat: number; lng: number };

  @Column({ type: 'enum', enum: EstadoPedido, default: EstadoPedido.PENDIENTE })
  estado: EstadoPedido;

  @Column({ type: 'boolean', default: false })
  cancelado: boolean;

  @ManyToOne(() => Cliente, cliente => cliente.pedidos)
  @JoinColumn({ name: 'clientes_id' })
  cliente: Cliente;

  @ManyToOne(() => Usuario, usuario => usuario.pedidos)
  @JoinColumn({ name: 'repartidor_id' })
  repartidor: Usuario;

  @OneToMany(() => DetallePedido, detallePedido => detallePedido.pedido)
  detallesPedidos: DetallePedido[];

  @OneToOne(() => Factura, factura => factura.pedido)
  @JoinColumn({ name: 'facturas_id' })
  factura: Factura;

  @OneToMany(() => PagoPedido, pagoPedido => pagoPedido.pedido)
  pagosPedido: PagoPedido[];
}
