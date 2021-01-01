// https://impuestos.gob.bo/ckeditor/plugins/imageuploader/uploads/360e8e0b9.pdf
export class Base64SIN {
  private static dictionary = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd',
    'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
    'y', 'z', '+', '/'
  ];

  parse(value: number): string {
    let quotient = 1;
    let remainder: number;
    let word = '';

    while (quotient > 0) {
      quotient = Math.trunc(value / 64);
      remainder = value % 64;
      word = Base64SIN.dictionary[remainder] + word;
      value = quotient;
    }

    return word;
  }
}
