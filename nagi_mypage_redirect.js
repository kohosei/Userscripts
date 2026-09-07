// ==UserScript==
// @name         aoyamanagisa mypage redirect except login
// @match        https://aoyamanagisa.jp/*
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