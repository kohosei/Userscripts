// ==UserScript==
// @name         plusmember apollobay auto login
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  plusmember Apollo Bay ログイン画面での自動ログイン実行
// @match        https://secure.plusmember.jp/apollobay/*/login/*
// @updateURL    https://raw.githubusercontent.com/kohosei/Userscripts/main/ab_auto_login.js
// @downloadURL  https://raw.githubusercontent.com/kohosei/Userscripts/main/ab_auto_login.js
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  let done = false;

  function nativeSet(el, value) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 'value'
    ).set;
    nativeInputValueSetter.call(el, value);
    ['input', 'change'].forEach(type =>
      el.dispatchEvent(new Event(type, { bubbles: true }))
    );
  }

  function tryLogin() {
    if (done) return false;

    const idInput = document.querySelector('input[aria-label="example@xxxx.com"]')
                 || document.querySelector('input[type="email"]')
                 || document.querySelectorAll('input[required]')[0];
    const pwInput = document.querySelector('input[aria-label="パスワードを入力してください"]')
                 || document.querySelector('input[type="password"]')
                 || document.querySelectorAll('input[required]')[1];

    const btn = [...document.querySelectorAll('button')]
                  .find(b => b.textContent.trim() === 'ログイン')
             || document.querySelector('button[type="submit"]')
             || document.querySelector('input[type="submit"]');

    if (!idInput || !pwInput || !btn) return false;
    if (!idInput.value || !pwInput.value) return false;

    done = true;

    nativeSet(idInput, idInput.value);
    nativeSet(pwInput, pwInput.value);

    setTimeout(() => {
      btn.click();
    }, 500);

    return true;
  }

  const observer = new MutationObserver(() => {
    if (tryLogin()) observer.disconnect();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['value']
  });

  if (document.readyState === 'complete') {
    setTimeout(() => { if (tryLogin()) observer.disconnect(); }, 1000);
  } else {
    window.addEventListener('load', () => {
      setTimeout(() => { if (tryLogin()) observer.disconnect(); }, 1000);
    });
  }

  setTimeout(() => observer.disconnect(), 15000);
})();
