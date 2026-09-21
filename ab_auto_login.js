// ==UserScript==
// @name         plusmember apollobay auto login
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Apollo Bay ログイン画面での自動ログイン実行（iOS Safariクラッシュ完全防止・イベント駆動型）
// @match        https://secure.plusmember.jp/apollobay/*/login/*
// @updateURL    https://raw.githubusercontent.com/kohosei/Userscripts/main/ab_auto_login.js
// @downloadURL  https://raw.githubusercontent.com/kohosei/Userscripts/main/ab_auto_login.js
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

  function trySubmit() {
    if (done) return;

    const { idInput, pwInput, btn } = findElements();
    if (!idInput || !pwInput || !btn) return;

    // パスワードまたはIDが空なら送信しない
    if (!idInput.value || !pwInput.value) return;

    done = true;

    // iOS Safari AutoFillやFace IDの認証シート・キーボードアクセサリの解体処理が
    // 完全に落ち着いてから安全にクリック（1000ms待機）
    setTimeout(() => {
      try {
        btn.click();
      } catch (e) {
        if (btn.form) {
          btn.form.submit();
        }
      }
    }, 1000);
  }

  // 重要: Safari UIProcess (AutoFill/Face ID) のクラッシュを防ぐため、
  // setInterval や MutationObserver で pwInput.value を能動的にポーリング取得しない。
  // ブラウザの AutoFill 確定時にネイティブに発火する change / input イベントを受動的に監視する。
  function setupListeners() {
    const { idInput, pwInput } = findElements();
    if (!idInput || !pwInput) return false;

    ['change', 'input'].forEach(eventType => {
      idInput.addEventListener(eventType, trySubmit, { passive: true });
      pwInput.addEventListener(eventType, trySubmit, { passive: true });
    });

    return true;
  }

  // 初期リスナー登録
  if (!setupListeners()) {
    window.addEventListener('DOMContentLoaded', setupListeners, { once: true });
    window.addEventListener('load', setupListeners, { once: true });
  }

  // 既にブラウザのキャッシュ等で値が入った状態で描画された場合のフォールバック
  // （Safari の AutoFill ピッカー初期化が完全に安定した 1.5 秒後に 1 度だけ安全に確認）
  window.addEventListener('load', () => {
    setTimeout(trySubmit, 1500);
  });
  if (document.readyState === 'complete') {
    setTimeout(trySubmit, 1500);
  }
})();
