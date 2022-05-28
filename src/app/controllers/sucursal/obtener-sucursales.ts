import { Request, Response } from 'express';
import { getRepository, Like } from 'typeorm';
import { Sucursal } from 'app/entities/sucursal';

export const obtenerSucursales = async (req: Request, res: Response) => {
  const skip = req.query.skip || 0;
  const take = req.query.take || 5;
  let termino = req.query.termino || '';
  termino = termino.toString().replace(/\ /g, '').split('').join('%');

  try {
    const [sucursales, total] = await getRepository(Sucursal)
      .findAndCount({
        skip: Number(skip),
        take: Number(take),
        where: { nombre: Like(`%${termino}%`)},
        order: { nombre: 'ASC' },
      });

    return res.json({
      values: sucursales,
      total,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
