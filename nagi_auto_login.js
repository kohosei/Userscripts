// ==UserScript==
// @name         aoyamanagisa mypage redirect + auto login
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  マイページへのリダイレクトおよび自動ログイン
// @match        https://aoyamanagisa.jp/*
// @updateURL    https://raw.githubusercontent.com/kohosei/Userscripts/main/nagi_auto_login.js
// @downloadURL  https://raw.githubusercontent.com/kohosei/Userscripts/main/nagi_auto_login.js
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const path = location.pathname;

  const isMyPage = path === '/mypage' || path.startsWith('/mypage/');
  const isLogin  = path === '/mypage/login' || path.startsWith('/mypage/login/');

  // /mypage 系でログイン画面以外はトップへリダイレクト
  if (isMyPage && !isLogin) {
    location.replace('https://aoyamanagisa.jp/');
    return;
  }

  // ログイン画面以外は何もしない
  if (!isLogin) return;

  // Firefoxの自動入力が完了するのを待ってからボタンを押す
  const timer = setInterval(() => {
    const btn = document.querySelector('input[type="submit"][value="ログイン"]');
    const idField = document.querySelector('input[type="text"], input[type="email"]');
    const pwField = document.querySelector('input[type="password"]');

    // ボタンが存在し、ID/PW両方に値が入っていたらクリック
    if (btn && idField?.value && pwField?.value) {
      clearInterval(timer);
      btn.click();
    }
  }, 300);

  // 10秒待っても揃わなければ諦める（手動でログイン）
  setTimeout(() => clearInterval(timer), 10000);
})();