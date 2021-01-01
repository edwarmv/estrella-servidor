import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Factura } from './factura';
import { Sucursal } from './sucursal';

@Entity('dosificaciones')
export class Dosificacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'numero_autorizacion' })
  numeroAutorizacion: string;

  @Column({ name: 'fecha_limite_emision' })
  fechaLimiteEmision: Date;

  @Column({ name: 'llave_dosificacion' })
  llaveDosificacion: string;

  @ManyToOne(() => Sucursal, sucursal => sucursal.dosificaciones)
  @JoinColumn({ name: 'sucursales_id' })
  sucursal: Sucursal;

  @OneToMany(() => Factura, factura => factura.dosificacion)
  facturas: Factura[];
}
