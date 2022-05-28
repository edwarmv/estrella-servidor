import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Pedido } from './pedido';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  nombre: string;

  @Column('varchar')
  apellido: string;

  @Column({ type: 'varchar', name: 'nit_ci' })
  nitCI: string;

  @Column({ type: 'varchar', name: 'telefono_fijo', nullable: true })
  telefonoFijo: string;

  @Column({ type: 'varchar', name: 'telefono_movil', nullable: true })
  telefonoMovil: string;

  @Column({ type: 'varchar', name: 'direccion_domicilio', nullable: true })
  direccionDomicilio: string;

  @Column({
    type: 'jsonb',
    name: 'coordenadas_direccion_domicilio',
    nullable: true
  })
  coordenadasDireccionDomicilio: { lat: number, lng: number };

  @OneToMany(() => Pedido, pedido => pedido.cliente)
  pedidos: Pedido[];
}
