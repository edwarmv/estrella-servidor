import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Dosificacion } from './dosificacion';
import { CasaMatriz } from './casa-matriz';
import { Caja } from './caja';
import { ProductoSucursal } from './producto-sucursal';

@Entity('sucursales')
export class Sucursal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'citext', unique: true })
  nombre: string;

  @Column()
  ubicacion: string;

  @Column()
  direccion: string;

  @Column({ name: 'numero_telefono' })
  numeroTelefono: string;

  @Column({ default: true })
  estado: boolean;

  @ManyToOne(() => CasaMatriz, casaMatriz => casaMatriz.sucursales)
  @JoinColumn({ name: 'casa_matriz_id' })
  casaMatriz: CasaMatriz;

  @OneToMany(() => Dosificacion, dosificacion => dosificacion.sucursal)
  dosificaciones: Dosificacion[];

  @OneToMany(() => Caja, caja => caja.sucursal)
  cajas: Caja[];

  @OneToMany(
    () => ProductoSucursal,
    productoSucursal => productoSucursal.sucursal
  )
  productosSucursales: ProductoSucursal[];
}
