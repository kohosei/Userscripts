// ==UserScript==
// @name         apollobaycruiser auto open login
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  未ログイン状態を検知して自動でログインページへ遷移（リダイレクトループ防止付き）
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

  // 短時間の連続リダイレクトによるクラッシュ（無限ループ）を防止
  const sessionKey = 'ab_login_redirect_timestamp';
  const lastRedirect = sessionStorage.getItem(sessionKey);
  const now = Date.now();
  if (lastRedirect && now - parseInt(lastRedirect, 10) < 5000) {
    return;
  }
  sessionStorage.setItem(sessionKey, now.toString());

  location.replace(href);
})();
