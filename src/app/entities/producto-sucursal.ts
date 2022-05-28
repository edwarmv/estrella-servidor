import { Entity, JoinColumn, ManyToOne, Column } from 'typeorm';
import { Producto } from './producto';
import { Sucursal } from './sucursal';

@Entity('productos_sucursales')
export class ProductoSucursal {
  @ManyToOne(() => Producto, producto => producto.productosSucursales, {
    primary: true,
  })
  @JoinColumn({ name: 'productos_id' })
  producto: Producto;

  @ManyToOne(() => Sucursal, sucursal => sucursal.productosSucursales, {
    primary: true,
  })
  @JoinColumn({ name: 'sucursales_id' })
  sucursal: Sucursal;

  @Column()
  existencias: number;
}
