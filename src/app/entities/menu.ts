import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RolMenu } from './rol-menu';

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  path: string;

  @OneToMany(() => RolMenu, rolMenu => rolMenu.menu)
  rolesMenus: RolMenu[];
}
