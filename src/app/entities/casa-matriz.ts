import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Sucursal } from './sucursal';

@Entity('casa_matriz')
export class CasaMatriz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  ubicacion: string;

  @Column()
  direccion: string;

  @Column({ name: 'descripcion_actividad_economica' })
  descripcionActividadEconomica: string;

  @Column({ name: 'numero_telefono' })
  numeroTelefono: string;

  @Column({ name: 'correo_electronico', nullable: true })
  correoElectronico: string;

  @Column()
  nit: string;

  @Column({ nullable: true })
  logotipo: string;

  @OneToMany(() => Sucursal, sucursal => sucursal.casaMatriz)
  sucursales: Sucursal[];
}
