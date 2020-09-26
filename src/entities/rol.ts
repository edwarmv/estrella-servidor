import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RolUsuario } from './rol-usuario';

@Entity('roles')
export class Rol {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  nombre: string;

  @Column('varchar', { nullable: true })
  descripcion: string;

  @OneToMany( type => RolUsuario, rolUsuario => rolUsuario.rol )
  rolesUsuarios: RolUsuario[];
}
