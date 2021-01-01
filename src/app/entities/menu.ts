import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Submenu } from './submenu';
import { RolMenu } from './rol-menu';

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @OneToMany(() => RolMenu, rolMenu => rolMenu.menu)
  rolesMenus: RolMenu[];

  @OneToMany(() => Submenu, submenu => submenu.menu)
  submenus: Submenu[];
}
