import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { Producto } from 'app/entities/producto';
import { TablaLog, OperacionTablaLog } from 'app/entities/tabla-log';
import { TableNames } from 'app/entities/table-names.enum';
import { TokenUtil } from 'app/utils/token.util';

type Body = {
  nombre: string;
  descripcion: string;
  precio: number;
  estado: string;
};

export const actualizarProducto = async (req: Request, res: Response) => {
  const id = req.params.id;
  const tokenUtil = new TokenUtil();
  const idUsuario = tokenUtil.getTokenPayload(req).sub;

  const { nombre, descripcion, precio, estado }: Body = req.body;

  const producto = await getRepository(Producto).findOne(id);
  if (!producto) {
    return res.status(409).json({ mensaje: 'Producto no encontrado' });
  }

  try {
    await getConnection().transaction(async transaction => {
      await transaction.update(Producto, id, {
        nombre,
        descripcion,
        precio,
        estado: estado === 'true' ? true : false,
      });
      const nuevoProducto = await transaction.findOne(Producto, id);
      await transaction.insert<TablaLog<Producto>>(TablaLog, {
        operacion: OperacionTablaLog.UPDATE,
        nombreTabla: TableNames.productos,
        usuario: { id: parseInt(idUsuario!) },
        antiguoValor: producto,
        nuevoValor: nuevoProducto,
      });
    });

    res.json({ mensaje: 'Producto actualizado' });
  } catch (error) {
    res.status(500).json(error);
  }
};
