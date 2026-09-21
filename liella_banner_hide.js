// ==UserScript==
// @name         Hide bnrlink on yuigaoka top only
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  https://www.lovelive-anime.jp/yuigaoka/ の .bnrlink を非表示
// @match        https://www.lovelive-anime.jp/yuigaoka/
// @updateURL    https://raw.githubusercontent.com/kohosei/Userscripts/main/liella_banner_hide.js
// @downloadURL  https://raw.githubusercontent.com/kohosei/Userscripts/main/liella_banner_hide.js
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const css = `
    .bnrlink {
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
