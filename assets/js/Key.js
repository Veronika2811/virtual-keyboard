import create from './createDomNode.js';

export default class Key {
  constructor({ small, shift, code }) {
    this.small = small;
    this.shift = shift;
    this.code = code;
    this.isFnKey = Boolean(
      code.match(/Control|Alt|Shift|Tab|Back|Del|Enter|Caps|Win/),
    );

    const letter = create('div', 'key', small);
    letter.dataset.code = this.code;
    this.letter = letter;
    this.letter.code = this.code;
  }
}
