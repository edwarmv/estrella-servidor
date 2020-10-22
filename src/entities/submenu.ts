import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Menu } from './menu';

@Entity('submenus')
export class Submenu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  path: string;

  @ManyToOne(() => Menu, menu => menu.submenus)
  @JoinColumn({ name: 'menus_id' })
  menu: Menu;
}
