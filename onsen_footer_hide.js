// ==UserScript==
// @name         Hide footer-bottom-wrapper on www.onsen.ag
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  .footer-bottom--wrapper を非表示
// @match        https://www.onsen.ag/*
// @match        http://www.onsen.ag/*
// @updateURL    https://raw.githubusercontent.com/kohosei/Userscripts/main/onsen_footer_hide.js
// @downloadURL  https://raw.githubusercontent.com/kohosei/Userscripts/main/onsen_footer_hide.js
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const css = `
    .footer-bottom--wrapper {
      display: none !important;
    }

    /* 以下20260613追加 */
    .footer-page {
        display: none !important;
    }

    .twitter-link--wrapper {
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
