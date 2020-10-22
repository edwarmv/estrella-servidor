import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Rol } from './rol';
import { Menu } from './menu';

@Entity('roles_menus')
export class RolMenu {
  @ManyToOne(
    () => Rol,
    rol => rol.rolesMenus,
    { primary: true }
  )
  @JoinColumn({ name: 'roles_id' })
  rol: Rol;

  @ManyToOne(
    () => Menu,
    menu => menu.rolesMenus,
    { primary: true }
  )
  @JoinColumn({ name: 'menus_id' })
  menu: Menu;
}
