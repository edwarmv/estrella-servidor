import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RolUsuario } from './rol-usuario';
import { RolMenu } from './rol-menu';

@Entity('roles')
export class Rol {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'citext', unique: true })
  nombre: string;

  @Column('varchar', { nullable: true })
  descripcion: string;

  @OneToMany(() => RolUsuario, rolUsuario => rolUsuario.rol)
  rolesUsuarios: RolUsuario[];

  @OneToMany(() => RolMenu, rolMenu => rolMenu.rol)
  rolesMenus: RolMenu[];
}
