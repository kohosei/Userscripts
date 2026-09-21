// ==UserScript==
// @name         Hide footer-bottom on aoyamanagisa.jp
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  footer.site-footer .footer-bottom を非表示
// @match        https://aoyamanagisa.jp/*
// @match        http://aoyamanagisa.jp/*
// @updateURL    https://raw.githubusercontent.com/kohosei/Userscripts/main/nagi_footer_hide.js
// @downloadURL  https://raw.githubusercontent.com/kohosei/Userscripts/main/nagi_footer_hide.js
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const css = `
    footer.site-footer .footer-bottom {
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
