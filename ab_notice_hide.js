// ==UserScript==
// @name         Hide sub-txt-list on apollobaycruiser.jp
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  .sub-txt-list を非表示
// @match        https://apollobaycruiser.jp/*
// @match        http://apollobaycruiser.jp/*
// @updateURL    https://raw.githubusercontent.com/kohosei/Userscripts/main/ab_notice_hide.js
// @downloadURL  https://raw.githubusercontent.com/kohosei/Userscripts/main/ab_notice_hide.js
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const css = `
    .sub-txt-list {
      display: none !important;
    }

    /* バースデーページ内など */
    .attention {
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
