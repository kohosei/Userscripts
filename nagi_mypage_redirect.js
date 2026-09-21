// ==UserScript==
// @name         aoyamanagisa mypage redirect except login
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  ログインページ以外の特定画面からマイページへ自動転送
// @match        https://aoyamanagisa.jp/*
// @updateURL    https://raw.githubusercontent.com/kohosei/Userscripts/main/nagi_mypage_redirect.js
// @downloadURL  https://raw.githubusercontent.com/kohosei/Userscripts/main/nagi_mypage_redirect.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const path = location.pathname;

  const isMyPage =
    path === '/mypage' || path.startsWith('/mypage/');

  const isLogin =
    path === '/mypage/login' || path.startsWith('/mypage/login/');

  if (isMyPage && !isLogin) {
    location.replace('https://aoyamanagisa.jp/');
  }
})();