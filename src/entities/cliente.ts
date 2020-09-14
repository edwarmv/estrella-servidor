import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('clientes')
export class Cliente {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  nombres: string;

  @Column('varchar')
  apellidos: string;

  @Column({ type: 'varchar', name: 'nit_ci' })
  nitCI: string;

  @Column({ type: 'varchar', name: 'telefono_fijo', nullable: true })
  telefonoFijo: string;

  @Column({ type: 'varchar', name: 'telefono_movil', nullable: true })
  telefonoMovil: string;

  @Column({ type: 'varchar', name: 'direccion_domicilio', nullable: true })
  direccionDomicilio: string;

  @Column({ type: 'varchar', name: 'coordenadas_direccion_domicilio', nullable: true })
  coordenadasDireccionDomicilio: string;
}
