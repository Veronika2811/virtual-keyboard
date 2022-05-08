import create from './createDomNode.js';

export default class Key {
  constructor({ small, shift, code }) {
    this.small = small;
    this.shift = shift;
    this.code = code;

    const letter = create('div', 'key', small);
    letter.dataset.code = this.code;
    this.letter = letter;
    this.letter.code = this.code;
  }
}
