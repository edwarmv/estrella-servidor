import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { MovimientoCaja } from 'app/entities/movimiento-caja';

export const obtenerMovimientosCajas = async (req: Request, res: Response) => {
  const skip = req.query.skip || 0;
  const take = req.query.take || 5;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  try {
    const query = getRepository(MovimientoCaja)
      .createQueryBuilder('movimiento-caja')
      .skip(Number(skip))
      .take(Number(take))
      .leftJoinAndSelect('movimiento-caja.caja', 'caja')
      .leftJoinAndSelect('movimiento-caja.usuario', 'usuario');

    if (startDate && endDate) {
      query.where(
        'movimiento-caja.fechaMovimiento BETWEEN :startDate AND :endDate',
        { startDate: `${startDate} 00:00:00`, endDate: `${endDate} 23:59:59` }
      );
    }

    const [values, total] = await query.getManyAndCount();

    return res.json({
      values,
      total,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
