// ==UserScript==
// @name         HideBlogComments
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  apollobaycruiser.jpのブログのコメント欄を非表示にするスタイル
// @match        https://apollobaycruiser.jp/blog/*
// @updateURL    https://raw.githubusercontent.com/kohosei/Userscripts/main/ab_comments_hide.js
// @downloadURL  https://raw.githubusercontent.com/kohosei/Userscripts/main/ab_comments_hide.js
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const css = `
    .block--comment {
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
