// ==UserScript==
// @name         Hide timeline title card on aoyamanagisa.jp
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  aoyamanagisa.jp/timeline のタイトルカードを非表示
// @match        https://aoyamanagisa.jp/timeline*
// @match        http://aoyamanagisa.jp/timeline*
// @updateURL    https://raw.githubusercontent.com/kohosei/Userscripts/main/nagi_hide_title.js
// @downloadURL  https://raw.githubusercontent.com/kohosei/Userscripts/main/nagi_hide_title.js
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const css = `
    #app > div.tl-content__top > timeline-widget.hydrated > div.tl-card.tl-card__title {
      display: none !important;
    }
  `;

  if (typeof GM_addStyle !== 'undefined') {
    GM_addStyle(css);
  } else {
    const style = document.createElement('style');
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }
})();
