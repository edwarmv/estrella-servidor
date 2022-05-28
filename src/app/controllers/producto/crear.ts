import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { Producto } from 'app/entities/producto';
import { TablaLog, OperacionTablaLog } from 'app/entities/tabla-log';
import { TokenUtil } from 'app/utils/token.util';
import { TableNames } from 'app/entities/table-names.enum';

type Body = {
  nombre: string;
  descripcion: string;
  precio: number;
  estado: string;
};

export const crearProducto = async (req: Request, res: Response) => {
  const { nombre, descripcion, precio, estado }: Body = req.body;
  const tokenUtil = new TokenUtil();
  const idUsuario = tokenUtil.getTokenPayload(req).sub;

  try {
    await getConnection().transaction(async transaction => {
      const producto = await transaction.save(Producto, {
        nombre,
        descripcion,
        precio,
        estado: estado === 'true' ? true : false,
      });

      await transaction.insert<TablaLog<Producto>>(TablaLog, {
        usuario: { id: parseInt(idUsuario!) },
        operacion: OperacionTablaLog.INSERT,
        nombreTabla: TableNames.productos,
        nuevoValor: producto,
      });

      res.status(201).json({ mensaje: 'Producto registrado', producto });
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
