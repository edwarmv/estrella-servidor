import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Rol } from './rol';
import { Usuario } from './usuario';

@Entity('roles_usuarios')
export class RolUsuario {

  @ManyToOne(type => Rol, rol => rol.rolesUsuarios, { primary: true })
  @JoinColumn({ name: 'roles_id' })
  rol: Rol;

  @ManyToOne(type => Usuario, usuario => usuario.rolesUsuarios, { primary: true })
  @JoinColumn({ name: 'usuarios_id' })
  usuario: Usuario;
}
