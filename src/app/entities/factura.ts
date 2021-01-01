import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn
} from 'typeorm';
import { Dosificacion } from './dosificacion';
import { Pedido } from './pedido';

@Entity('facturas')
export class Factura {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'numero_factura' })
  numeroFactura: number;

  @CreateDateColumn({ name: 'fecha_emision' })
  fechaEmision: Date;

  @Column({ default: false })
  anulado: boolean;

  @ManyToOne(() => Dosificacion, dosificacion => dosificacion.facturas)
  @JoinColumn({ name: 'dosificaciones_id' })
  dosificacion: Dosificacion;

  @OneToOne(() => Pedido, pedido => pedido.factura)
  pedido: Pedido;
}
