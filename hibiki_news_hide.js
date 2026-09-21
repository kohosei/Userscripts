// ==UserScript==
// @name         Hide news-list on hibiki-radio.jp
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  .news-list を非表示
// @match        https://hibiki-radio.jp/*
// @match        http://hibiki-radio.jp/*
// @updateURL    https://raw.githubusercontent.com/kohosei/Userscripts/main/hibiki_news_hide.js
// @downloadURL  https://raw.githubusercontent.com/kohosei/Userscripts/main/hibiki_news_hide.js
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const css = `
    .news-list {
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
