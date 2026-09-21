// ==UserScript==
// @name         QloveR コメント非表示
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  QloveR 配信画面のチャット・コメント欄を非表示
// @match        https://qlover.jp/*
// @updateURL    https://raw.githubusercontent.com/kohosei/Userscripts/main/qlover_comments_hide.js
// @downloadURL  https://raw.githubusercontent.com/kohosei/Userscripts/main/qlover_comments_hide.js
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const css = `
    .EnableCommentArea-chatContent {
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
