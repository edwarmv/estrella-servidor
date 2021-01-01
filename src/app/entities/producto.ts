import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DetallePedido } from './detalle-pedido';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @Column('varchar', { nullable: true })
  descripcion: string;

  @Column('numeric', { precision: 4, scale: 2 })
  precio: number;

  @Column('varchar', { nullable: true })
  foto: string;

  @Column({ default: true })
  estado: boolean;

  @OneToMany(() => DetallePedido, detallePedido => detallePedido.producto )
  detallesPedidos: DetallePedido[];
}
