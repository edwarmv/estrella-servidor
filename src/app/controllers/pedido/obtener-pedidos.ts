import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Pedido } from 'app/entities/pedido';

export class ObtenerPedidos {
  constructor() {
    this.exec = this.exec.bind(this);
  }
   async exec (req: Request, res: Response) {
    const skip = req.query.skip || 0;
    const take = req.query.take || 5;
    const start = req.query.start;
    const end = req.query.end;
    const sort = req.query.sort || 'fechaEntrega';
    const order = req.query.order ===  'DESC' ? 'DESC' : 'ASC';
    const termino = req.query.termino || '';

    try {
      if (start && end) {
        const [pedidos, total] = await this.pedidosCalendario(
          start.toString(),
          end.toString(),
          sort.toString(),
          order
        );

        return res.json({ pedidos, total });
      } else {
        const [pedidos, total] = await this.pedidosPaginacion(
          Number(skip),
          Number(take),
          termino.toString(),
          sort.toString(),
          order
        );

        return res.json({ pedidos, total });
      }

    } catch(error) {
      res.status(500).json(error);
    }
  }

  private pedidosPaginacion(
    skip: number,
    take: number,
    termino: string,
    sort: string,
    order: 'DESC' | 'ASC'
  ): Promise<[Pedido[], number]> {
    return getRepository(Pedido)
    .createQueryBuilder('pedido')
    .leftJoinAndSelect('pedido.cliente', 'cliente')
    .skip(skip)
    .take(take)
    .where(
      'LOWER(cliente.nombre) LIKE :nombre',
      { nombre: `%${termino.toLowerCase()}%` }
    )
    .orWhere(
      'LOWER(cliente.apellido) LIKE :apellido',
      { apellido: `%${termino.toLowerCase()}%` }
    )
    .orderBy(`pedido.${sort}`, order)
    .getManyAndCount();
  }

  /**
   * @param start Fecha YYYY-MM-DD
   * @param end Fecha YYYY-MM-DD
   */
  private pedidosCalendario(
    start: string,
    end: string,
    sort: string,
    order: 'DESC' | 'ASC'
  ): Promise<[Pedido[], number]> {
    return getRepository(Pedido)
    .createQueryBuilder('pedido')
    .leftJoinAndSelect('pedido.cliente', 'cliente')
    .where(`pedido.fechaEntrega BETWEEN\
'${start} 00:00:00' AND '${end} 23:59:59'`)
    .orderBy(`pedido.${sort}`, order)
    .getManyAndCount();
  }
}
