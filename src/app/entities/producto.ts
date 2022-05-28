import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DetallePedido } from './detalle-pedido';
import { CategoriaProductoProducto } from './categoria-producto-producto';
import { ProductoSucursal } from './producto-sucursal';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'citext' })
  nombre: string;

  @Column('varchar', { nullable: true })
  descripcion: string;

  @Column('numeric', { precision: 4, scale: 2 })
  precio: number;

  @Column('varchar', { nullable: true })
  foto: string;

  @Column({ default: true })
  estado: boolean;

  @OneToMany(() => DetallePedido, detallePedido => detallePedido.producto)
  detallesPedidos: DetallePedido[];

  @OneToMany(
    () => CategoriaProductoProducto,
    categoriaProductoProducto => categoriaProductoProducto.producto
  )
  categoriasProductosProductos: CategoriaProductoProducto[];

  @OneToMany(
    () => ProductoSucursal,
    productoSucursal => productoSucursal.producto
  )
  productosSucursales: ProductoSucursal[];
}
