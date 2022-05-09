import { set } from './storage.js';
import create from './createDomNode.js';
import language from './languages.js';
import Key from './Key.js';

export default class Keyboard {
  constructor(rows) {
    this.rows = rows;
    this.buttons = [];
    this.isCaps = false;
    this.isShift = false;
  }

  init(langCode) {
    this.currentLanguageObject = language[langCode];

    const main = create('main', 'main');
    main.dataset.language = langCode;

    const title = create('h1', 'title', 'RSS Virtual Keyboard');

    const subtitle = create(
      'h2',
      'subtitle',
      'The keyboard was created in the MacOs operating system',
    );

    const description = create(
      'h3',
      'description',
      'To switch the language, the combination control + option (Ctrl + Alt)',
    );
    description.style.color = 'red';

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
      this.keyboard,
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
    this.keyboard.addEventListener('mousedown', this.mouseHandleEvent);
    this.keyboard.addEventListener('mouseup', this.mouseHandleEvent);
  }

  mouseHandleEvent = (event) => {
    event.stopPropagation();
    const buttonClick = event.target.closest('.key');
    if (!buttonClick) {
      return;
    }
    this.handleEvent({ code: buttonClick.code, type: event.type });
  };

  handleEvent = (event) => {
    if (event.stopPropagation) {
      event.stopPropagation();
    }

    this.textarea.focus();

    const { code, type } = event;
    const buttonObject = this.buttons.find((key) => key.code === code);

    if (type === 'keydown' || type === 'mousedown') {
      buttonObject.letter.classList.add('active');

      if (type === 'keydown') {
        event.preventDefault();
      }

      if (code === 'ShiftLeft' || code === 'ShiftRight') {
        this.shiftKey = true;
      }

      if (this.shiftKey) {
        this.changeCharactersKeyboard(true);
      }

      if (code === 'CapsLock' && !this.isCaps) {
        this.isCaps = true;
        this.changeCharactersKeyboard(true);
      } else if (code === 'CapsLock' && this.isCaps) {
        this.isCaps = false;
        this.changeCharactersKeyboard(false);
        buttonObject.letter.classList.remove('active');
      }

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

      if (!this.isCaps) {
        this.printToTextarea(
          buttonObject,
          this.shiftKey ? buttonObject.shift : buttonObject.small,
        );
      } else if (this.isCaps) {
        this.printToTextarea(
          buttonObject,
          this.shiftKey ? buttonObject.small : buttonObject.shift,
        );
      }
    } else if (type === 'keyup' || type === 'mouseup') {
      if (code === 'ShiftLeft' || code === 'ShiftRight') {
        this.shiftKey = false;
        this.changeCharactersKeyboard(false);
      }

      if (code === 'ControlLeft' || code === 'ControlRight') {
        this.keyCtrl = false;
      }
      if (code === 'AltLeft' || code === 'AltRight') {
        this.keyAlt = false;
      }

      if (code !== 'CapsLock') {
        buttonObject.letter.classList.remove('active');
      }
    }
  };

  changeCharactersKeyboard(isTrue) {
    if (isTrue) {
      this.buttons.forEach((button) => {
        this.button = button;
        if (!button.isFnKey && this.isCaps && !this.shiftKey) {
          this.button.letter.textContent = button.shift;
        } else if (!button.isFnKey && this.isCaps && this.shiftKey) {
          this.button.letter.innerHTML = button.small;
        } else if (!button.isFnKey && !this.isCaps && this.shiftKey) {
          this.button.letter.innerHTML = button.shift;
        }
      });
    } else {
      this.buttons.forEach((button) => {
        if (!button.isFnKey) {
          this.button = button;
          if (!this.isCaps) {
            this.button.letter.textContent = button.small;
          } else {
            this.button.letter.textContent = button.shift;
          }
        }
      });
    }
  }

  switchLanguage() {
    const arrayOfLanguages = Object.keys(language);
    let langIndex = arrayOfLanguages.indexOf(this.main.dataset.language);

    this.currentLanguageObject = langIndex === 0
      ? language[arrayOfLanguages[(langIndex = 1)]]
      : language[arrayOfLanguages[(langIndex = 0)]];

    this.main.dataset.language = arrayOfLanguages[langIndex];

    set('currentLang', arrayOfLanguages[langIndex]);

    this.buttons.forEach((el) => {
      this.el = el;
      const currentLang = this.main.dataset.language;
      const currentArr = language[currentLang];
      const key = currentArr.find((btn) => btn.code === el.code);

      this.el.shift = key.shift;
      this.el.small = key.small;

      this.el.letter.textContent = key.small;
    });

    if (this.isCaps) {
      this.changeCharactersKeyboard(true);
    }
  }

  printToTextarea(buttonObject, symbol) {
    let cursorPosition = this.textarea.selectionStart;
    const leftSide = this.textarea.value.slice(0, cursorPosition);
    const rightSide = this.textarea.value.slice(cursorPosition);

    switch (buttonObject.code) {
      case 'Tab':
        this.textarea.value = `${leftSide}\t${rightSide}`;
        cursorPosition += 1;
        break;
      case 'Enter':
        this.textarea.value = `${leftSide}\n${rightSide}`;
        cursorPosition += 1;
        break;
      case 'Backspace':
        this.textarea.value = `${leftSide.slice(0, -1)}${rightSide}`;
        cursorPosition -= 1;
        break;
      case 'Space':
        this.textarea.value = `${leftSide} ${rightSide}`;
        break;
      case 'MetaLeft':
        break;
      case 'MetaRight':
        break;
      default:
        break;
    }
    if (this.printToTextarea[buttonObject.code]) {
      this.printToTextarea[buttonObject.code]();
    } else if (!buttonObject.isFnKey) {
      cursorPosition += 1;
      this.textarea.value = `${leftSide}${symbol || ''}${rightSide}`;
    }
    this.textarea.setSelectionRange(cursorPosition, cursorPosition);
  }
}
