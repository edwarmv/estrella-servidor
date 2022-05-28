import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { CategoriaProducto } from './categoria-producto';
import { Producto } from './producto';

@Entity('categorias_productos_productos')
export class CategoriaProductoProducto {
  @ManyToOne(
    () => CategoriaProducto,
    categoriaProducto => categoriaProducto.categoriasProductosProductos,
    {
      primary: true,
      onDelete: 'CASCADE',
    }
  )
  @JoinColumn({ name: 'categorias_productos_id' })
  categoriaProducto: CategoriaProducto;

  @ManyToOne(
    () => Producto,
    producto => producto.categoriasProductosProductos,
    {
      primary: true,
    }
  )
  @JoinColumn({ name: 'productos_id' })
  producto: Producto;
}
