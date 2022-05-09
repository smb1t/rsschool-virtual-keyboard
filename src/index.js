import './scss/style.scss';
import keysEn from './assets/keys-en.json';
import keysRu from './assets/keys-ru.json';

const keysLang = {
  en: keysEn,
  ru: keysRu,
};

class VirtualKeyboard {
  constructor() {
    if (!localStorage.getItem('lang')) localStorage.setItem('lang', 'en');
    this.lang = localStorage.getItem('lang');

    this.rows = 5;
    this.kboardInner = null;
    this.keyClasses = [
      'lowwercase',
      'uppercase',
      'capson',
      'shiftcaps',
    ];

    this.keySpecClasses = {
      Backspace: 'key--backspace',
      Tab: 'key--tab',
      CapsLock: 'key--caps-lock',
      Enter: 'key--enter',
      ShiftLeft: 'key--shift-left',
      ShiftRight: 'key--shift-right',
      Space: 'key--space',
      AltLeft: 'key--alt-left',
      AltRight: 'key--alt-right',
    };
    this.CapsLock = false;
    this.letters = ['Backquote', 'BracketLeft', 'BracketRight', 'Semicolon', 'Quote', 'Comma', 'Period'];

    // this.createBoard();
  }

  init() {
    this.createBoard();
  }

  // eslint-disable-next-line class-methods-use-this
  createElement(settings) {
    const item = document.createElement(settings.element);
    const attrKeys = Object.keys(settings.attributes);
    const attrVals = Object.values(settings.attributes);

    for (let i = 0; i < attrKeys.length; i += 1) {
      item.setAttribute(attrKeys[i], attrVals[i]);
    }
    settings.parent.appendChild(item);

    return item;
  }

  createBoard() {
    const container = this.createElement({
      parent: document.body,
      element: 'div',
      attributes: { class: 'keyboard-container' },
    });

    const title = this.createElement({
      parent: container,
      element: 'h1',
      attributes: {
        class: 'title',
      },
    });

    title.innerText = 'RSS Virtual Keyboard.';

    // eslint-disable-next-line no-unused-vars
    const inputArea = this.createElement({
      parent: container,
      element: 'textarea',
      attributes: {
        name: 'input-area',
        class: 'input-area',
        colls: '30',
        rows: '5',
      },
    });

    const kboard = this.createElement({
      parent: container,
      element: 'div',
      attributes: { class: 'keyboard' },
    });

    this.kboardInner = this.createElement({
      parent: kboard,
      element: 'div',
      attributes: { class: 'keyboard__inner' },
    });

    this.fillBoard();
  }

  fillBoard() {
    for (let i = 0; i < this.rows; i += 1) { // 5 rows
      const row = this.createElement({
        parent: this.kboardInner,
        element: 'div',
        attributes: { class: 'row' },
      });

      const keyNames = Object.keys(keysLang[this.lang][i]);

      for (let j = 0; j < keyNames.length; j += 1) {
        this.createKey(keyNames[j], i, row);
      }
    }
  }

  createKey(name, index, parent) {
    const key = this.createElement({
      parent,
      element: 'div',
      attributes: {
        class: 'key',
        'data-name': name,
      },
    });

    if (name in this.keySpecClasses) key.classList.add(this.keySpecClasses[name]);

    const langs = Object.keys(keysLang);

    for (let i = 0; i < langs.length; i += 1) {
      const span = this.createElement({
        parent: key,
        element: 'span',
        attributes: {
          'data-lang': langs[i],
        },
      });

      if (this.lang !== langs[i]) span.classList.add('hidden');

      const keyCont = keysLang[langs[i]][index][name];

      for (let j = 0; j < 4; j += 1) {
        const spanInner = this.createElement({
          parent: span,
          element: 'span',
          attributes: {
            class: `${this.keyClasses[j]} hidden`,
          },
        });

        if (!this.CapsLock && j === 0) spanInner.classList.remove('hidden');
        if (this.CapsLock && j === 2) spanInner.classList.remove('hidden');

        let c = j;
        const ifLet = name.indexOf('Key') >= 0 || this.letters.includes(name);

        if (j === 2) c = ifLet ? j - 1 : 0;
        if (j === 3) c = ifLet ? c = j - 3 : 1;

        spanInner.innerText = keyCont[c];
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const keyboard = new VirtualKeyboard();
  keyboard.init();
// export default VirtualKeyboard;
});
