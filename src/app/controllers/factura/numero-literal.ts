export class NumeroLiteral {
  convertir(num: number, moneda: string) {
    const enteros = Math.floor(num);
    const centavos = (((Math.round(num * 100)) - (Math.floor(num) * 100)));

    return `${this.millones(enteros)?.toUpperCase()} \
${centavos === 0 ? '0' + centavos : centavos}/100 ${moneda}.`;
  }

  private millones(num: number) {
    const divisor = 1000000;
    const cientos = Math.floor(num / divisor);
    const resto = num - (cientos * divisor);

    const literalMillones = this.seccion(num, divisor, 'un millon', 'millones');
    const literalMiles = this.miles(resto);

    if(literalMillones === '') {
      return literalMiles;
    }

    return `${literalMillones} ${literalMiles}`;
  }

  private miles(num: number) {
    const divisor = 1000;
    const cientos = Math.floor(num / divisor);
    const resto = num - (cientos * divisor);

    const literalMiles = this.seccion(num, divisor, 'un mil', 'mil');
    const literalCentenas = this.centenas(resto);

    if(literalMiles === '') {
      return literalCentenas;
    }

    return `${literalMiles}\
${literalCentenas ? ' ' + literalCentenas : literalCentenas}`;
  }

  private seccion(
    num: number,
    divisor: number,
    literalSingular: string,
    literalPlural: string
  ) {
    const cientos = Math.floor(num / divisor);
    const resto = num - (cientos * divisor);

    let letras = '';

    if (cientos > 0) {
      if (cientos > 1) {
        letras = this.centenas(cientos) + ' ' + literalPlural;
      } else {
        letras = literalSingular;
      }
    }

    if (resto > 0) {
      letras += '';
    }

    return letras;
  }

  private centenas(num: number) {
    const centenas = Math.floor(num / 100);
    const decenas = num - (centenas * 100);
    const decenasLiteral = this.decenas(decenas);
    let centenasLiteral = '';

    switch (centenas) {
      case 1:
        if (decenas > 0) {
          centenasLiteral = 'ciento';
        } else {
          centenasLiteral = 'cien';
        }
        break;
      case 2: centenasLiteral = 'doscientos'; break;
      case 3: centenasLiteral = 'trescientos'; break;
      case 4: centenasLiteral = 'cuatrocientos'; break;
      case 5: centenasLiteral = 'quinientos'; break;
      case 6: centenasLiteral = 'seiscientos'; break;
      case 7: centenasLiteral = 'setecientos'; break;
      case 8: centenasLiteral = 'ochocientos'; break;
      case 9: centenasLiteral = 'novecientos'; break;
    }

    return centenasLiteral === '' ? this.decenas(decenas)
      : `${centenasLiteral}${decenasLiteral ? ' ' + decenasLiteral : ''}`;
  }

  private decenas(num: number) {
    const decena = Math.floor(num/10);
    const unidad = num - (decena * 10);

    switch (decena) {
      case 1:
        switch (unidad) {
          case 0: return 'diez';
          case 1: return 'once';
          case 2: return 'doce';
          case 3: return 'trece';
          case 4: return 'catorcE';
          case 5: return 'quince';
          default: return 'dieci' + this.unidades(unidad);
        }
      case 2:
        switch (unidad) {
          case 0: return 'veinte';
          default: return 'veinti' + this.unidades(unidad);
        }
      case 3: return this.decenasY('treinta', unidad);
      case 4: return this.decenasY('cuarenta', unidad);
      case 5: return this.decenasY('cincuenta', unidad);
      case 6: return this.decenasY('sesenta', unidad);
      case 7: return this.decenasY('setenta', unidad);
      case 8: return this.decenasY('ochenta', unidad);
      case 9: return this.decenasY('noventa', unidad);
      default: return this.unidades(unidad);
    }
  }

  private decenasY(literal: string, unidad: number) {
    if (unidad > 0) {
      return `${literal} y ${this.unidades(unidad)}`;
    }

    return literal;
  }

  private unidades(num: number) {
    switch (num) {
        case 1: return 'un';
        case 2: return 'dos';
        case 3: return 'tres';
        case 4: return 'cuatro';
        case 5: return 'cinco';
        case 6: return 'seis';
        case 7: return 'siete';
        case 8: return 'ocho';
        case 9: return 'nueve';
        default: return '';
    }
  }
}
