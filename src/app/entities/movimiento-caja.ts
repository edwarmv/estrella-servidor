import {
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Caja } from './caja';
import { Usuario } from './usuario';

export enum TipoMovimientoCaja {
  INGRESO_EFECTIVO = 'ingreso_efectivo',
  RETIRO_EFECTIVO = 'retiro_efectivo',
}

@Entity('movientos_cajas')
export class MovimientoCaja {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'fecha_movimiento' })
  fechaMovimiento: Date;

  @Column({
    type: 'enum',
    enum: TipoMovimientoCaja,
    name: 'tipo_movimiento_caja',
  })
  tipo: TipoMovimientoCaja;

  @Column({
    name: 'estado_anterior',
    type: 'numeric',
    precision: 4,
    scale: 2,
  })
  estadoAnterior: number;

  @Column({
    name: 'cantidad',
    type: 'numeric',
    precision: 4,
    scale: 2,
  })
  cantidad: number;

  @Column({
    name: 'estado_actual',
    type: 'numeric',
    precision: 4,
    scale: 2,
  })
  estadoActual: number;

  @Column({ name: 'motivo_movimiento' })
  motivoMovimiento: string;

  @ManyToOne(() => Caja, caja => caja.movimientosCajas)
  @JoinColumn({ name: 'cajas_id' })
  caja: Caja;

  @ManyToOne(() => Usuario, usuario => usuario.movimientosCajas)
  @JoinColumn({ name: 'usuarios_id' })
  usuario: Usuario;
}
