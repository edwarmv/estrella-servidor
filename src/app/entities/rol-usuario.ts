import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Rol } from './rol';
import { Usuario } from './usuario';

@Entity('roles_usuarios')
export class RolUsuario {

  @ManyToOne(() => Rol, rol => rol.rolesUsuarios, { primary: true })
  @JoinColumn({ name: 'roles_id' })
  rol: Rol;

  @ManyToOne(
    () => Usuario,
    usuario => usuario.rolesUsuarios,
    { primary: true }
  )
  @JoinColumn({ name: 'usuarios_id' })
  usuario: Usuario;

  @Column({ name: 'rol_por_defecto', default: false })
  rolPorDefecto: boolean;
}
