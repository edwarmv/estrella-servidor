import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Pedido } from "./pedido";

@Entity('pagos_pedido')
export class PagoPedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('numeric', { precision: 4, scale: 2 })
  monto: number;

  @CreateDateColumn({ name: 'fecha_pago '})
  fechaPago: Date;

  @ManyToOne(() => Pedido, pedido => pedido.pagosPedido, { primary: true })
  @JoinColumn({ name: 'pedido_id' })
  pedido: Pedido;
}
