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
    this.keyEventsHandler();
  }

  keyEventsHandler() {
    const keys = document.querySelectorAll('.key');
    document.addEventListener('keydown', (e) => {
      const activeKey = document.querySelector(`[data-name=${e.code}]`);
      activeKey.classList.add('is-pressed');

      if (e.shiftKey && e.ctrlKey) this.changeLang(keys);
      if (e.code === 'CapsLock') {
        this.CapsLock = !this.CapsLock;
        activeKey.classList.toggle('is-active');
        this.capsLockHandler(keys);
      }

      if (e.shiftKey) this.shiftHandler(keys, e.type);
    });
    document.addEventListener('keyup', (e) => {
      for (let i = 0; i < keys.length; i += 1) {
        const activeKey = document.querySelector(`[data-name=${e.code}]`);
        activeKey.classList.remove('is-pressed');
      }

      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.shiftHandler(keys, e.type);
    });
  }

  shiftHandler(keys, evenType) {
    for (let i = 0; i < keys.length; i += 1) {
      const span = keys[i].querySelector(`[data-lang="${this.lang}"]`);
      const lc = span.querySelector('.lowwercase');
      const uc = span.querySelector('.uppercase');
      const co = span.querySelector('.capson');
      const sc = span.querySelector('.shiftcaps');

      if (evenType === 'keydown') {
        if (this.CapsLock) {
          co.classList.add('hidden');
          sc.classList.remove('hidden');
        } else {
          lc.classList.add('hidden');
          uc.classList.remove('hidden');
        }
      }
      if (evenType === 'keyup') {
        if (this.CapsLock) {
          co.classList.remove('hidden');
          sc.classList.add('hidden');
        } else {
          lc.classList.remove('hidden');
          uc.classList.add('hidden');
        }
      }
    }
  }

  capsLockHandler(keys) {
    for (let i = 0; i < keys.length; i += 1) {
      const span = keys[i].querySelector(`[data-lang="${this.lang}"]`);
      const inners = [
        span.querySelector('.lowwercase'),
        span.querySelector('.capson'),
      ];

      for (let j = 0; j < inners.length; j += 1) {
        inners[j].classList.toggle('hidden');
      }
    }
  }

  changeLang(keys) {
    if (this.lang === 'en') {
      localStorage.setItem('lang', 'ru');
      this.lang = localStorage.getItem('lang');
    } else {
      localStorage.setItem('lang', 'en');
      this.lang = localStorage.getItem('lang');
    }

    for (let i = 0; i < keys.length; i += 1) {
      const spans = keys[i].children;
      for (let j = 0; j < spans.length; j += 1) {
        spans[j].classList.toggle('hidden');

        if (spans[j].getAttribute('data-name') !== this.lang) {
          const inners = spans[j].querySelectorAll('span');
          for (let k = 0; k < inners.length; k += 1) {
            if (!inners[k].classList.contains('hidden')) inners[k].classList.add('hidden');
          }
        }
      }
    }
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
