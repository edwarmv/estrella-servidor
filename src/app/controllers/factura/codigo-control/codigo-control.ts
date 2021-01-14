import { Verhoeff } from './verhoeff.ts';
import { AllegedRC4 } from './alleged-rc4';
import { Base64SIN } from './base64';

// https://impuestos.gob.bo/ckeditor/plugins/imageuploader/uploads/356aea02e.pdf
export class CodigoControl {
  private verhoeff = new Verhoeff();
  private allegedRC4 = new AllegedRC4();
  private base64SIN = new Base64SIN();

  /**
   * Genera un código de control
   * @param numeroAutorizacion
   * @param numeroFactura
   * @param nitCI
   * @param fechaTransaccion
   * @param montoTransaccion monto redondeado, p.ej. 0.5 -> 1
   * @param llaveDosificacion
   */
  generarCodigo(
    numeroAutorizacion: string,
    numeroFactura: string,
    nitCI: string,
    fechaTransaccion: Date | string,
    montoTransaccion: string,
    llaveDosificacion: string
  ): string {
    if (fechaTransaccion instanceof Date) {
      const date = fechaTransaccion.getDate() < 10 ?
        '0' + fechaTransaccion.getDate() :
        fechaTransaccion.getDate().toString();

      const month = fechaTransaccion.getMonth() < 10 ?
        '0' + fechaTransaccion.getMonth() :
        fechaTransaccion.getMonth().toString();

      const year = fechaTransaccion.getFullYear();

      fechaTransaccion = `${year}${month}${date}`;
    }

    const { digitosVerhoeff, insumo } = this.paso1(
      numeroFactura,
      nitCI,
      fechaTransaccion,
      montoTransaccion
    );

    const message = this.paso2(
      digitosVerhoeff,
      llaveDosificacion,
      numeroAutorizacion,
      insumo.numeroFactura,
      insumo.nitCI,
      insumo.fechaTransaccion,
      insumo.montoTransaccion
    );

    // Paso 3
    const key = llaveDosificacion + digitosVerhoeff;
    const encryptedMessage = this.allegedRC4
      .encryptMessageRC4NoHyphen(message, key);

    // Paso 4
    const paso4 = this.paso4(encryptedMessage);

    // Paso 5
    const paso5 = this.paso5(digitosVerhoeff, paso4);

    // Paso 6
    const codigoControl = this.allegedRC4.encryptMessageRC4(paso5, key);

    return codigoControl;
  }

  private paso1(...digits: string[]): {
    digitosVerhoeff: string,
    insumo: {
      numeroFactura: string,
      nitCI: string,
      fechaTransaccion: string,
      montoTransaccion: string
    }
  } {
   let aux: string;
   digits.forEach((value, i) => {
      aux = value + this.verhoeff.generateCheckDigit(value);
      digits[i] = aux + this.verhoeff.generateCheckDigit(aux);
   });

   const numeroFactura = digits[0];
   const nitCI = digits[1];
   const fechaTransaccion = digits[2];
   const montoTransaccion = digits[3];

   let sum = 0;
   digits.forEach(value => sum = sum + parseInt(value, 10));

   let fiveDigits: string = sum.toString();
   for (let i = 0; i < 5; i++) {
     fiveDigits = fiveDigits + this.verhoeff.generateCheckDigit(fiveDigits);
   }

   return {
     digitosVerhoeff: fiveDigits.slice(-5),
     insumo: {
       numeroFactura,
       nitCI,
       fechaTransaccion,
       montoTransaccion
     }
   };
  }

  private paso2(
    digitosVerhoeff: string,
    llaveDosificacion: string,
    numeroAutorizacion: string,
    numeroFactura: string,
    nitCI: string,
    fechaTransaccion: string,
    montoTransaccion: string
  ): string {
    const array = digitosVerhoeff.split('');
    let aux = 0;
    array.forEach((value, i) => {
      array[i] = llaveDosificacion
        .substring(aux, (parseInt(value, 10) + 1 + aux));
      aux += parseInt(value, 10) + 1;
    });

    numeroAutorizacion += array[0];
    numeroFactura += array[1];
    nitCI += array[2];
    fechaTransaccion += array[3];
    montoTransaccion += array[4];

    return numeroAutorizacion +
           numeroFactura +
           nitCI +
           fechaTransaccion +
           montoTransaccion;
  }

  private paso4(allegedRC4: string): { total: number, parciales: number[] } {
    const array = allegedRC4.split('');

    let total = 0;
    const parciales = new Array<number>(5).fill(0);
    let aux = 1;
    array.forEach(value => {
      total += value.charCodeAt(0);
      switch (aux) {
        case 1: parciales[0] += value.charCodeAt(0); break;
        case 2: parciales[1] += value.charCodeAt(0); break;
        case 3: parciales[2] += value.charCodeAt(0); break;
        case 4: parciales[3] += value.charCodeAt(0); break;
        case 5: parciales[4] += value.charCodeAt(0); break;
      }
      aux = aux < 5 ? aux + 1 : 1;
    });

    return { total, parciales };
  }

  private paso5(
    digitosVerhoeff: string,
    paso4: { total: number, parciales: number[] }
  ): string {
    let total = 0;
    paso4.parciales.forEach((value, i) => {
      total += Math.trunc(paso4.total * value /
                          (parseInt(digitosVerhoeff.charAt(i), 10) + 1));
    });

    return this.base64SIN.parse(total);
  }
}
