import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CategoriaProductoProducto } from './categoria-producto-producto';

@Entity('categorias_productos')
export class CategoriaProducto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'citext' })
  nombre: string;

  @OneToMany(
    () => CategoriaProductoProducto,
    categoriaProductoProducto => categoriaProductoProducto.categoriaProducto
  )
  categoriasProductosProductos: CategoriaProductoProducto[];
}
