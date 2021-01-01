import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Dosificacion } from './dosificacion';
import { CasaMatriz } from './casa-matriz';

@Entity('sucursales')
export class Sucursal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  ubicacion: string;

  @Column()
  direccion: string;

  @Column({ name: 'numero_telefono' })
  numeroTelefono: string;

  @ManyToOne(() => CasaMatriz, casaMatriz => casaMatriz.sucursales)
  @JoinColumn({ name: 'casa_matriz_id' })
  casaMatriz: CasaMatriz;

  @OneToMany(() => Dosificacion, dosificacion => dosificacion.sucursal)
  dosificaciones: Dosificacion[];
}
