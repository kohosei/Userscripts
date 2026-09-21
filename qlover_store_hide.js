// ==UserScript==
// @name         QloveR SmartBanner非表示
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  QloveR アプリインストール誘導バナー（SmartBanner）を非表示
// @match        https://qlover.jp/*
// @updateURL    https://raw.githubusercontent.com/kohosei/Userscripts/main/qlover_store_hide.js
// @downloadURL  https://raw.githubusercontent.com/kohosei/Userscripts/main/qlover_store_hide.js
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const css = `
    /* SmartBanner本体を消す
    .SmartBanner-bannerApp {
      display: none !important;
    }
    */
  `;

  if (typeof GM_addStyle !== 'undefined') {
    GM_addStyle(css);
  } else {
    const style = document.createElement('style');
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }
})();
