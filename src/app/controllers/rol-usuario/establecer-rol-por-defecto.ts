import { Response, Request } from 'express';
import { getRepository } from 'typeorm';
import { RolUsuario } from 'app/entities/rol-usuario';

export class EstablecerRolPorDefectoController {
  async exec(req: Request, res: Response) {
    const idRol = req.body.idRol;

    const rolPorDefectoAntiguo = await getRepository(RolUsuario)
    .findOne({ rolPorDefecto: true });

    if (rolPorDefectoAntiguo) {
      await getRepository(RolUsuario)
      .update(
        rolPorDefectoAntiguo,
        { rolPorDefecto: false }
      );
    }

    await getRepository(RolUsuario)
    .update(
      { rol: { id: Number.parseInt(idRol, 10) }  },
      { rolPorDefecto: true }
    );

    res.json({ mensaje: 'Rol por defecto cambiado correctamente' });
  }
}
