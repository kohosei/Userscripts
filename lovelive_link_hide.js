// ==UserScript==
// @name         Hide link on lovelive
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  ラブライブ！公式サイトのSNSリンク・フッター外枠を非表示
// @match        https://www.lovelive-anime.jp/*
// @updateURL    https://raw.githubusercontent.com/kohosei/Userscripts/main/lovelive_link_hide.js
// @downloadURL  https://raw.githubusercontent.com/kohosei/Userscripts/main/lovelive_link_hide.js
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const css = `
    .l-header__sns,
    .p-sns,
    .p-series__itembottom,
    .l-footer__outer {
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
