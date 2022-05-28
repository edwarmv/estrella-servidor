import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { randomBytes, scryptSync } from 'crypto';
import { RolUsuario } from './rol-usuario';
import { Pedido } from './pedido';
import { TablaLog } from './tabla-log';
import { Cliente } from './cliente';
import { MovimientoCaja } from './movimiento-caja';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  nombre: string;

  @Column('varchar')
  apellido: string;

  @Column({ type: 'citext', name: 'correo_electronico', unique: true })
  correoElectronico: string;

  @Column({ type: 'varchar', name: 'foto_perfil', nullable: true })
  fotoPerfil: string;

  @Column({ type: 'boolean', name: 'cuenta_verificada', default: false })
  cuentaVerificada: boolean;

  @Column({ default: true })
  estado: boolean;

  @Column({ type: 'varchar', select: false })
  key: string;

  @Column({ type: 'varchar', select: false })
  salt: string;

  @OneToMany(() => RolUsuario, rolUsuario => rolUsuario.usuario)
  rolesUsuarios: RolUsuario[];

  @OneToMany(() => Pedido, pedido => pedido.repartidor)
  pedidos: Pedido[];

  @OneToOne(() => Cliente)
  @JoinColumn({ name: 'clientes_id' })
  cliente: Cliente;

  @OneToMany(() => TablaLog, tablaLog => tablaLog.usuario)
  tablaLogs: TablaLog<any>[];

  @OneToMany(() => MovimientoCaja, movimientoCaja => movimientoCaja.usuario)
  movimientosCajas: MovimientoCaja[]

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

