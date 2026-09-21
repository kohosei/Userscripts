// ==UserScript==
// @name         apollobaycruiser auto open login
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  未ログイン状態を検知して自動でログインページへ遷移
// @match        https://apollobaycruiser.jp/*
// @updateURL    https://raw.githubusercontent.com/kohosei/Userscripts/main/ab_open_login_page.js
// @downloadURL  https://raw.githubusercontent.com/kohosei/Userscripts/main/ab_open_login_page.js
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const link = document.querySelector('li.nav--login a');
  if (!link) return;

  const href = link.getAttribute('href');
  if (!href) return;

  location.href = href;
})();
