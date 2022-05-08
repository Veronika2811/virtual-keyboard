import { set } from './storage.js';
import create from './createDomNode.js';
import language from './languages.js';
import Key from './Key.js';

export default class Keyboard {
  constructor(rows) {
    this.rows = rows;
    this.buttons = [];
    this.rowElement = '';
  }

  init(langCode) {
    this.currentLanguageObject = language[langCode];

    const main = create('main', 'main');
    main.dataset.language = langCode;

    const title = create('h1', 'title', 'RSS Virtual Keyboard');

    const subtitle = create(
      'h2',
      'subtitle',
      'The keyboard was created in the Windows operating system',
    );

    const description = create(
      'h3',
      'description',
      'To switch the language, the combination Ctrl + Alt',
    );

    const textarea = create('textarea', 'textarea', '', 'Welcome...');

    const keyboard = create('div', 'keyboard');

    this.main = main;
    this.title = title;
    this.subtitle = subtitle;
    this.description = description;
    this.textarea = textarea;
    this.keyboard = keyboard;

    main.append(
      this.title,
      this.subtitle,
      this.description,
      this.textarea,
      keyboard,
    );

    document.body.prepend(this.main);

    return this;
  }

  generateKeyboard() {
    this.rows.forEach((row) => {
      const rowsElement = create('div', 'row');

      row.forEach((code) => {
        const buttonObject = this.currentLanguageObject.find(
          (element) => element.code === code,
        );

        if (buttonObject) {
          const button = new Key(buttonObject);
          this.buttons.push(button);
          rowsElement.append(button.letter);
        }

        this.keyboard.append(rowsElement);
      });
    });

    document.addEventListener('keydown', this.handleEvent);
    document.addEventListener('keyup', this.handleEvent);
    this.keyboard.addEventListener('mousedown', this.preHandleEvent);
    this.keyboard.addEventListener('mouseup', this.preHandleEvent);
  }

  handleEvent = (event) => {
    if (event.stopPropagation) {
      event.stopPropagation();
    }

    this.textarea.focus();

    const { code, type } = event;

    const buttonObject = this.buttons.find((key) => key.code === code);

    if (type.match(/keydown|mousedown/)) {
      buttonObject.letter.classList.add('active');

      if (type.match(/key/)) {
        event.preventDefault();
      }
      // Смена языка
      if (code === 'ControlLeft' || code === 'ControlRight') {
        this.keyCtrl = true;
      }
      if (code === 'AltLeft' || code === 'AltRight') {
        this.keyAlt = true;
      }

      if ((code === 'ControlLeft' || code === 'ControlRight') && this.keyAlt) {
        this.switchLanguage();
      }
      if ((code === 'AltLeft' || code === 'AltRight') && this.keyCtrl) {
        this.switchLanguage();
      }
    } else if (type.match(/keyup|mouseup/)) {
      buttonObject.letter.classList.remove('active');
      // Смена языка
      if (code === 'ControlLeft' || code === 'ControlRight') {
        this.keyCtrl = false;
      }
      if (code === 'AltLeft' || code === 'AltRight') {
        this.keyAlt = false;
      }
    }
  };

  switchLanguage() {
    const arrayOfLanguages = Object.keys(language);
    let langIndex = arrayOfLanguages.indexOf(this.main.dataset.language);

    this.currentLanguageObject = langIndex === 0
      ? language[arrayOfLanguages[(langIndex = 1)]]
      : language[arrayOfLanguages[(langIndex = 0)]];

    this.main.dataset.language = arrayOfLanguages[langIndex];

    set('kbLang', arrayOfLanguages[langIndex]);

    this.buttons.forEach((el) => {
      this.el = el;
      const currentLang = this.main.dataset.language;
      const currentArr = language[currentLang];
      const key = currentArr.find((btn) => btn.code === el.code);

      this.el.shift = key.shift;
      this.el.small = key.small;

      this.el.letter.textContent = key.small;
    });
  }
}
