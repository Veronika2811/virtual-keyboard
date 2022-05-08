import create from './createDomNode.js';
import language from './languages.js';
import Key from './Key.js';

export default class Keyboard {
  constructor(langCode, rows) {
    this.rows = rows;
    this.buttons = [];
    this.rowElement = '';
    this.KeyBase = language[langCode];
  }

  init() {
    const main = create('main', 'main');

    const title = create('h1', 'title', 'RSS Virtual Keyboard');

    const mac = create(
      'h2',
      'subtitle',
      'The keyboard was created in the macOS operating system',
    );

    const desc = create(
      'h3',
      'description',
      'To switch the language, the combination Ctrl + Alt',
    );

    const output = create('textarea', 'output', '', 'Welcome...');

    const keyboard = create('div', 'keyboard');

    this.main = main;
    this.title = title;
    this.mac = mac;
    this.desc = desc;
    this.output = output;
    this.keyboard = keyboard;

    main.append(title, mac, desc, output, keyboard);

    document.body.prepend(main);
    return this;
  }

  generateRows() {
    this.rows.forEach((row) => {
      const rowsElement = create('div', 'row');
      row.forEach((code) => {
        const elementBtn = this.buttons.find(
          (element) => element.code === code,
        );
        // elementBtn.onclick = (e) => {
        //   console.log(e.target.code)
        // }
        this.elementBtn = elementBtn;
        // console.log(this.buttons)
        rowsElement.append(elementBtn);
        this.keyboard.append(rowsElement);
      });
    });

    document.addEventListener('keydown', this.handleEvent);
    document.addEventListener('keyup', this.handleEvent);

    return this;
  }

  generateButton() {
    this.KeyBase.forEach((element) => {
      const item = new Key(element);
      this.buttons.push(item.letter);
    });
    return this;
  }

  handleEvent = (event) => {
    this.output.focus();

    const { code, type } = event;

    const keysOne = this.buttons.find((key) => key.code === code);

    if (type.match(/keydown|mousedown/)) {
      keysOne.classList.add('active');
    } else if (type.match(/keyup|mouseup/)) {
      keysOne.classList.remove('active');
    }
  };
}
