
// ==UserScript==
// @name         plusmember apollobay auto login
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Apollo Bay ログイン画面での自動ログイン実行（iOS Safari AutoFillクラッシュ対応）
// @match        https://secure.plusmember.jp/apollobay/*/login/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  let done = false;

  function findElements() {
    const idInput = document.querySelector('#form_id')
                 || document.querySelector('input[name="form[id]"]')
                 || document.querySelector('input[placeholder="example@xxxx.com"]')
                 || document.querySelector('input[type="email"]')
                 || document.querySelectorAll('input[required]')[0];

    const pwInput = document.querySelector('#form_pass')
                 || document.querySelector('input[name="form[pass]"]')
                 || document.querySelector('input[placeholder="パスワードを入力してください"]')
                 || document.querySelector('input[type="password"]')
                 || document.querySelectorAll('input[required]')[1];

    const btn = document.querySelector('input[type="submit"][value="ログイン"]')
             || document.querySelector('.section--login input.btn--main')
             || document.querySelector('input[type="submit"]')
             || [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'ログイン')
             || document.querySelector('button[type="submit"]');

    return { idInput, pwInput, btn };
  }

  function checkAndLogin() {
    if (done) return true;

    const { idInput, pwInput, btn } = findElements();
    if (!idInput || !pwInput || !btn) return false;

    // IDとパスワードの両方に値が入っているか確認
    const hasId = Boolean(idInput.value && idInput.value.trim().length > 0);
    const hasPw = Boolean(pwInput.value && pwInput.value.trim().length > 0);

    if (!hasId || !hasPw) return false;

    done = true;

    // iOS Safari AutoFillやFace IDの処理完了・画面解体との競合クラッシュを防ぐため、
    // 安定化ディレイを置いてから安全にクリックする
    setTimeout(() => {
      try {
        btn.click();
      } catch (e) {
        if (btn.form) {
          btn.form.submit();
        }
      }
    }, 800);

    return true;
  }

  // 1. 定期ポーリングによる安全な値検知（iOS Safari AutoFill・Android両対応）
  const timer = setInterval(() => {
    if (checkAndLogin()) {
      clearInterval(timer);
    }
  }, 250);

  // 2. DOM要素の遅延追加に対応するMutationObserver
  const observer = new MutationObserver(() => {
    if (checkAndLogin()) {
      clearInterval(timer);
      observer.disconnect();
    }
  });

  if (document.body || document.documentElement) {
    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  // 最大15秒で監視を解除
  setTimeout(() => {
    clearInterval(timer);
    observer.disconnect();
  }, 15000);
})();
