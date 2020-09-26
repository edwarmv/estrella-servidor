import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { randomBytes, scryptSync } from 'crypto';
import { RolUsuario } from './rol-usuario';
import { Pedido } from './pedido';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  nombres: string;

  @Column('varchar')
  apellidos: string;

  @Column({ type: 'varchar', name: 'nit_ci', nullable: true })
  nitCI: string;

  @Column({ type: 'varchar', name: 'telefono_fijo', nullable: true })
  telefonoFijo: string;

  @Column({ type: 'varchar', name: 'telefono_movil', nullable: true })
  telefonoMovil: string;

  @Column({ type: 'varchar', name: 'direccion_domicilio', nullable: true })
  direccionDomicilio: string;

  @Column({
    type: 'varchar',
    name: 'coordenadas_direccion_domicilio',
    nullable: true
  })
  coordenadasDireccionDomicilio: string;

  @Column({ type: 'varchar', name: 'correo_electronico', unique: true })
  correoElectronico: string;

  @Column({ type: 'varchar', name: 'foto_perfil', nullable: true })
  fotoPerfil: string;

  @Column({ type: 'boolean', name: 'cuenta_verificada', default: false })
  cuentaVerificada: boolean;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
    name: 'es_empleado'
  })
  esEmpleado: boolean;

  @Column('varchar')
  key: string;

  @Column('varchar')
  salt: string;

  @OneToMany( type => RolUsuario, rolUsuario => rolUsuario.usuario )
  rolesUsuarios: RolUsuario[];

  @OneToMany(type => Pedido, pedido => pedido.usuario)
  pedidos: Pedido[];

  setPassword(password: string): void  {
    const salt = randomBytes(8).toString('hex');
    this.key = scryptSync(password, salt,64).toString('hex');
    this.salt = salt;
  }

  verificarPassword(password: string): boolean {
    const key = scryptSync(password, this.salt, 64).toString('hex');
    return this.key === key;
  }
}
