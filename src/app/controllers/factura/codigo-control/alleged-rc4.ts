// https://impuestos.gob.bo/ckeditor/plugins/imageuploader/uploads/358e7c0d0.pdf
export class AllegedRC4 {
  encryptMessageRC4(message: string, key: string): string {
    const state = new Array<number>(256);
    for (let i = 0; i < state.length; i++) {
      state[i] = i;
    }
    let x = 0;
    let y = 0;
    let index1 = 0;
    let index2 = 0;
    let nMen: number;
    let encryptedMessage = '';

    state.forEach((value, i) => {
      index2 = (key.charCodeAt(index1) + state[i] + index2) % 256;
      state[i] = state[index2];
      state[index2] = value;
      index1 = (index1 + 1) % key.length;
    });

    let aux: number;
    message.split('').forEach(value => {
      x = (x + 1) % 256;
      y = (state[x] + y) % 256;
      aux = state[x];
      state[x] = state[y];
      state[y] = aux;
      // tslint:disable-next-line: no-bitwise
      nMen = value.charCodeAt(0) ^ state[(state[x] + state[y]) % 256];
      const nMenHex = nMen.toString(16);
      encryptedMessage = `\
${encryptedMessage}-${nMenHex.length === 1 ? '0' + nMenHex : nMenHex}`;
    });

    return encryptedMessage.slice(1).toUpperCase();
  }

  encryptMessageRC4NoHyphen(message: string, key: string): string {
    return this.encryptMessageRC4(message, key).replace(/-/g, '');
  }
}
