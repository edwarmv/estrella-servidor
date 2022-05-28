import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany, JoinColumn, Unique } from 'typeorm';
import { Sucursal } from './sucursal';
import { MovimientoCaja } from './movimiento-caja';

@Entity('cajas')
@Unique(['nombre', 'sucursal'])
export class Caja {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('citext')
  nombre: string;

  @Column({ default: true })
  estado: boolean;

  @ManyToOne(() => Sucursal, sucursal => sucursal.cajas)
  @JoinColumn({ name: 'sucursales_id' })
  sucursal: Sucursal;

  @OneToMany(() => MovimientoCaja, movimientoCaja => movimientoCaja.caja)
  movimientosCajas: MovimientoCaja[];
}
