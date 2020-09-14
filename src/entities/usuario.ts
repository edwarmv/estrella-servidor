import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { randomBytes, scrypt, scryptSync } from 'crypto';
import { RolUsuario } from './rol-usuario';

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

  @Column({ type: 'varchar', name: 'coordenadas_direccion_domicilio', nullable: true })
  coordenadasDireccionDomicilio: string;

  @Column({ type: 'varchar', name: 'correo_electronico', unique: true })
  correoElectronico: string;

  @Column({ type: 'varchar', name: 'foto_perfil', nullable: true })
  fotoPerfil: string;

  @Column({ type: 'boolean', name: 'cuenta_verificada', default: false })
  cuentaVerificada: boolean;

  @Column({ type: 'boolean', nullable: false, default: false, name: 'es_empleado' })
  esEmpleado: boolean;

  @Column('varchar')
  key: string;

  @Column('varchar')
  salt: string;

  @OneToMany(type => RolUsuario, rolUsuario => rolUsuario.usuario, { onDelete: 'CASCADE' })
  rolesUsuarios: RolUsuario[];

  setPassword(password: string): void  {
    const salt = randomBytes(8).toString('hex');
    this.key = scryptSync(password, salt,64).toString('hex');
    this.salt = salt;
  }

  // setPassword(password: string): Promise<void | Error> {
    // return new Promise((resolve, reject) => {
      // const salt = randomBytes(8).toString('hex');

      // scrypt(password, salt, 64, (err, derivedKey) => {
        // if (err) reject(err);

        // this.salt = salt;
        // this.key = derivedKey.toString('hex');

        // resolve();
      // });
    // });
  // }

  verificarPassword(password: string): boolean {
    const key = scryptSync(password, this.salt, 64).toString('hex');
    return this.key === key;
  }

  // verificarPassword(password: string): Promise<boolean | Error> {
    // return new Promise((resolve, reject) => {
      // scrypt(password, this.salt as string, 64, (err, derivedKey) => {
        // if (err) reject(err);

        // resolve(this.key === derivedKey.toString('hex'));
      // });
    // });
  // }
}
