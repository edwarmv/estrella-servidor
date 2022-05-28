import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Pedido } from 'app/entities/pedido';

export class ObtenerPedidos {
  constructor() {
    this.exec = this.exec.bind(this);
  }

  async exec(req: Request, res: Response) {
    const skip = req.query.skip || 0;
    const take = req.query.take || 5;
    const start = req.query.start || '';
    const end = req.query.end || '';
    const sort = req.query.sort || 'fechaRegistro';
    const order = req.query.order === 'DESC' ? 'DESC' : 'ASC';
    const termino = req.query.termino || '';
    const estado = req.query.estado || '';
    const facturado = req.query.facturado === '1' ? true : false;
    const conServicioEntrega =
      req.query.conServicioEntrega === '1' ? true : false;
    const repartidorAsignado = req.query.repartidorAsignado || '';
    const idRepartidor = req.query.idRepartidor || '';

    try {
      const [pedidos, total] = await this.pedidosPaginacion({
        skip: Number(skip),
        take: Number(take),
        start: start.toString(),
        end: end.toString(),
        termino: termino.toString(),
        sort: sort.toString(),
        order,
        estado: estado.toString(),
        facturado,
        conServicioEntrega,
        repartidorAsignado: repartidorAsignado as string,
        idRepartidor: idRepartidor.toString(),
      });

      return res.json({ pedidos, total });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  private pedidosPaginacion({
    skip,
    take,
    start,
    end,
    termino,
    sort,
    order,
    estado,
    facturado,
    conServicioEntrega,
    repartidorAsignado,
    idRepartidor,
  }: {
    skip: number;
    take: number;
    start: string;
    end: string;
    termino: string;
    sort: string;
    order: 'DESC' | 'ASC';
    estado: string;
    facturado: boolean;
    conServicioEntrega: boolean;
    repartidorAsignado: string;
    idRepartidor: string;
  }): Promise<[Pedido[], number]> {
    const query = getRepository(Pedido)
      .createQueryBuilder('pedido')
      .leftJoinAndSelect('pedido.cliente', 'cliente')
      .leftJoinAndSelect('pedido.repartidor', 'repartidor')
      .leftJoinAndSelect('pedido.factura', 'factura')
      .skip(skip)
      .take(take)
      .orderBy(`pedido.${sort}`, order);

    if (termino) {
      query.where(
        "LOWER(cliente.nombre || ' ' || cliente.apellido) LIKE :nombre",
        { nombre: `%${termino.toLowerCase()}%` }
      );
    }

    if (estado) {
      query.andWhere('pedido.estado = :estado', { estado });
    }

    if (repartidorAsignado) {
      query.andWhere(
        `repartidor.id IS ${repartidorAsignado === '1' ? 'NOT' : ''} NULL`
      );
    }

    if (idRepartidor) {
      query.andWhere('repartidor.id = :idRepartidor', { idRepartidor });
    }

    if (facturado) {
      query.innerJoinAndSelect('pedido.factura', 'factura');
    }

    if (conServicioEntrega) {
      query.andWhere('pedido.conServicioEntrega = TRUE');
    }

    if (start && end) {
      query.andWhere('pedido.fechaEntrega BETWEEN :start AND :end', {
        start: `${start} 00:00:00`,
        end: `${end} 23:59:59`,
      });
    }

    return query.getManyAndCount();
  }
}
