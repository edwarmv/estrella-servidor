import { Router } from 'express';
import { obtenerCasaMatriz } from 'app/controllers/casa-matriz/obtener-casa-matriz';
import { actualizarCasaMatriz } from 'app/controllers/casa-matriz/actualizar';

export const casaMatrizRoutes = Router();

casaMatrizRoutes.get('/casa-matriz', obtenerCasaMatriz);

casaMatrizRoutes.put('/casa-matriz', actualizarCasaMatriz);
