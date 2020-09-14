import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario';

@Entity('token_verificacion')
export class TokenVerificacion {

  @OneToOne(type => Usuario, { primary: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column('varchar')
  token: string;
}
