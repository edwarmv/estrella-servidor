import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Caja } from 'app/entities/caja';

export const obtenerCajas = async (req: Request, res: Response) => {
  const skip = req.query.skip || 0;
  const take = req.query.take || 5;
  let termino = req.query.termino || '';
  termino = termino.toString().replace(/\ /g, '').split('').join('%');

  try {
    const [cajas, total] = await getRepository(Caja)
      .createQueryBuilder('caja')
      .skip(Number(skip))
      .take(Number(take))
      .leftJoinAndSelect('caja.sucursal', 'sucursal')
      .where('CONCAT(caja.nombre, sucursal.nombre) IlIKE :termino', {
        termino: `%${termino}%`,
      })
      .orderBy('caja.nombre', 'ASC')
      .getManyAndCount();

    return res.json({ values: cajas, total });
  } catch (error) {
    return res.status(500).json(error);
  }
};
