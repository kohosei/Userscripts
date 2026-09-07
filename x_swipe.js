// ==UserScript==
// @name         X (Twitter) Swipe Tab Switcher
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  X のタイムラインタブ（For you / Following / 固定List）を左右スワイプで切り替える
// @author       You
// @match        https://x.com/*
// @match        https://twitter.com/*
// @noframes
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  // iframe内での多重実行を防止
  if (window.top !== window) return;

  let startX = 0;
  let startY = 0;
  let startActiveIdx = -1;
  let isIgnoredTouch = false;
  let lastSwipeTime = 0;
  const SWIPE_THRESHOLD = 50;   // スワイプと判定する最小px
  const ANGLE_LIMIT = 45;        // 水平方向の角度制限（度）
  const SWIPE_COOLDOWN = 350;   // スワイプ後のクールダウン時間(ms)

  // タブ要素を取得する関数
  function getTabLinks() {
    // ホームタイムラインのタブバー内の role="tab" を優先取得
    const tablist = document.querySelector(
      'nav[aria-label] div[role="tablist"], [data-testid="primaryColumn"] div[role="tablist"], div[role="tablist"]'
    );
    if (tablist) {
      const tabs = tablist.querySelectorAll('[role="tab"]');
      if (tabs.length > 0) return Array.from(tabs);
    }

    // fallback: aria-selected を持つ要素または横スクロールタブ
    const fallbackTabs = document.querySelectorAll(
      'nav[aria-label] a[role="tab"], nav[aria-label] div[role="tab"], div[data-testid="ScrollSnap-List"] [role="tab"]'
    );
    return Array.from(fallbackTabs);
  }

  // 現在アクティブなタブのインデックスを返す
  function getActiveIndex(tabs) {
    const idx = tabs.findIndex(
      (t) => t.getAttribute('aria-selected') === 'true' || t.dataset.active === 'true'
    );
    if (idx !== -1) return idx;

    // aria-selected が取得できない場合のURL推定フォールバック
    const currentPath = location.pathname;
    const pathIdx = tabs.findIndex((t) => {
      const href = t.getAttribute('href') || t.querySelector('a')?.getAttribute('href') || '';
      return currentPath === href || (href && href !== '/' && currentPath.startsWith(href));
    });
    return pathIdx !== -1 ? pathIdx : 0;
  }

  // タブをクリック
  function clickTab(tab) {
    tab.click();
  }

  // 対象要素が画像・メディア・横スクロールエリア等でスワイプ対象外にすべきか判定
  function isIgnoredElement(target) {
    if (!target) return false;
    const el = target instanceof Element ? target : target.parentElement;
    if (!el) return false;

    // 1. 画像・動画・メディア関連要素のチェック
    const mediaSelector = [
      'img',
      'video',
      'canvas',
      'svg',
      '[role="img"]',
      '[data-testid="tweetPhoto"]',
      '[data-testid="tweetPhotoRow"]',
      '[data-testid="media"]',
      '[data-testid="videoPlayer"]',
      '[data-testid="videoComponent"]',
      '[data-testid="swipe-gallery"]',
      '[data-testid="PhotoRail"]',
      '[data-testid="lightbox"]',
      '[role="dialog"]'
    ].join(',');

    if (el.closest(mediaSelector)) {
      return true;
    }

    // 2. 横スクロール可能なコンテナのチェック（トップのタブバー領域以外）
    let current = el;
    while (current && current !== document.body && current !== document.documentElement) {
      if (current.matches && current.matches('nav[aria-label], div[role="tablist"]')) {
        break;
      }

      try {
        const style = window.getComputedStyle(current);
        const overflowX = style.overflowX;
        if ((overflowX === 'scroll' || overflowX === 'auto') && current.scrollWidth > current.clientWidth + 5) {
          return true;
        }
      } catch (err) {
        // 無視
      }

      current = current.parentElement;
    }

    return false;
  }

  // スワイプ開始
  document.addEventListener('touchstart', (e) => {
    if (!e.touches || e.touches.length === 0) return;
    const target = e.touches[0].target || e.target;
    isIgnoredTouch = isIgnoredElement(target);

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;

    // スワイプ開始時点のアクティブタブを記憶（iOS Safariの自動切り替え先行対策）
    if (!isIgnoredTouch) {
      const tabs = getTabLinks();
      if (tabs.length > 0) {
        startActiveIdx = getActiveIndex(tabs);
      }
    }
  }, { passive: true });

  // スワイプ終了
  document.addEventListener('touchend', (e) => {
    if (isIgnoredTouch) return;
    if (!e.changedTouches || e.changedTouches.length === 0) return;

    const endTarget = e.changedTouches[0].target || e.target;
    if (isIgnoredElement(endTarget)) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    if (typeof document.elementFromPoint === 'function') {
      const pointTarget = document.elementFromPoint(endX, endY);
      if (isIgnoredElement(pointTarget)) return;
    }

    const dx = endX - startX;
    const dy = endY - startY;

    // 水平スワイプ判定
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    const angle = Math.abs(Math.atan2(dy, dx) * (180 / Math.PI));
    if (angle > ANGLE_LIMIT && angle < (180 - ANGLE_LIMIT)) return;

    // クールダウン判定
    const now = Date.now();
    if (now - lastSwipeTime < SWIPE_COOLDOWN) return;

    const tabs = getTabLinks();
    if (tabs.length === 0) return;

    // startActiveIdx が取得できていない場合の保険
    const baseIdx = startActiveIdx !== -1 ? startActiveIdx : getActiveIndex(tabs);

    let nextIdx;
    if (dx < 0) {
      // 左スワイプ（順方向） → 右のタブへ（必ず +1）
      nextIdx = baseIdx + 1;
      if (nextIdx >= tabs.length) return; // 末端
    } else {
      // 右スワイプ（逆方向） → 左のタブへ（必ず -1）
      nextIdx = baseIdx - 1;
      if (nextIdx < 0) return; // 先頭
    }

    lastSwipeTime = now;
    startActiveIdx = -1; // リセット

    // すでに目的のタブがアクティブな場合はクリックしない
    // （Followingタブが選択中の状態で再度clickされると「Sort by」メニューが開いてしまうため）
    const currentActiveIdx = getActiveIndex(tabs);
    if (currentActiveIdx !== nextIdx) {
      clickTab(tabs[nextIdx]);
    }

    // スワイプ後にタブが画面内に見えるようスクロール
    tabs[nextIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, { passive: true });

})();