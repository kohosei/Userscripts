// ==UserScript==
// @name         JOQR Hide Copyright
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  文化放送 超!A&G+ の著作権表示フッターを非表示
// @match        https://www.joqr.co.jp/ag/*
// @updateURL    https://raw.githubusercontent.com/kohosei/Userscripts/main/joqr_cpr_hide.js
// @downloadURL  https://raw.githubusercontent.com/kohosei/Userscripts/main/joqr_cpr_hide.js
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const css = `
    .c-copyright {
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
