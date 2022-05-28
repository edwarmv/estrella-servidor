import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Usuario } from "./usuario";
import { TableNames } from "./table-names.enum";

export enum OperacionTablaLog {
  INSERT = 'insert',
  UPDATE = 'update',
  DELETE = 'delete'
}

@Entity('tabla_log')
export class TablaLog<T> {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'fecha_registro' })
  fecha_registro: Date;

  @Column({ type: 'enum', enum: OperacionTablaLog })
  operacion: OperacionTablaLog;

  @Column({ type: 'enum', enum: TableNames })
  nombreTabla: string;

  @ManyToOne(() => Usuario, usuario => usuario.tablaLogs, { nullable: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({
    type: 'jsonb',
    name: 'nuevo_valor',
    nullable: true
  })
  nuevoValor: T;

  @Column({
    type: 'jsonb',
    name: 'antiguo_valor',
    nullable: true
  })
  antiguoValor: T;
}
