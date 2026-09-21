// ==UserScript==
// @name         音泉 お気に入り番組 並び替えトグル
// @namespace    https://www.onsen.ag/
// @version      3.2.0
// @description  音泉のお気に入り番組を 元の順番 / 更新順 / 逆順 でトグル切替。デフォルトは更新順。お気に入り番組タブ表示時のみボタンを表示。
// @author       you
// @match        https://www.onsen.ag/
// @updateURL    https://raw.githubusercontent.com/kohosei/Userscripts/main/onsen_order.js
// @downloadURL  https://raw.githubusercontent.com/kohosei/Userscripts/main/onsen_order.js
// @grant        GM_xmlhttpRequest
// @connect      www.onsen.ag
// ==/UserScript==

(function () {
  'use strict';

  const API_URL = 'https://www.onsen.ag/web_api/programs';
  const STORAGE_KEY_MODE = 'onsen_fav_sort_mode';

  const SORT_MODE = {
    ORIGINAL: 'original',
    UPDATED:  'updated',
    REVERSED: 'reversed',
  };

  const MODE_LABEL = {
    [SORT_MODE.ORIGINAL]: 'デフォルト',
    [SORT_MODE.UPDATED]:  '更新日',
    [SORT_MODE.REVERSED]: '逆順',
  };

  let sortMode = localStorage.getItem(STORAGE_KEY_MODE) || SORT_MODE.UPDATED;
  let observer = null;
  let applyTimer = null;
  let programMapCache = null;
  let apiLoading = false;

  // ----------------------------------------
  // お気に入り番組タブが表示されているか確認
  // ----------------------------------------
  function isFavTabVisible() {
    const favTab = document.querySelector('#inner-tab1C');
    if (!favTab) return false;
    const style = window.getComputedStyle(favTab);
    return style.display !== 'none' && !!favTab.querySelector('#category-video');
  }

  // ----------------------------------------
  // リスト取得
  // ----------------------------------------
  function getList() {
    return document.querySelector('#category-video');
  }

  // ----------------------------------------
  // カードから directory_name を取得
  // ----------------------------------------
  function getDirectoryNameFromItem(item) {
    if (!item) return null;
    if (item.dataset.directoryName) return item.dataset.directoryName;
    const links = item.querySelectorAll('a[href*="/program/"]');
    for (const link of links) {
      const href = link.getAttribute('href') || '';
      const match = href.match(/\/program\/([^/?#]+)/);
      if (match) {
        item.dataset.directoryName = match[1];
        return match[1];
      }
    }
    if (item.tagName === 'A') {
      const href = item.getAttribute('href') || '';
      const match = href.match(/\/program\/([^/?#]+)/);
      if (match) {
        item.dataset.directoryName = match[1];
        return match[1];
      }
    }
    return null;
  }

  // ----------------------------------------
  // program.contents の1エントリから日付数値を返す
  // streaming_url の /YYYYMM/ と delivery_date の M/D を組み合わせる
  // ----------------------------------------
  function getContentDateNumber(content) {
    if (!content || !content.streaming_url) return null;
    const ymMatch = content.streaming_url.match(/\/(\d{6})\//);
    if (!ymMatch) return null;
    const yyyymm = ymMatch[1];
    const yyyy   = yyyymm.slice(0, 4);
    const mmFromUrl = yyyymm.slice(4, 6);
    if (!content.delivery_date) {
      return parseInt(yyyy + mmFromUrl + '00', 10);
    }
    const parts = content.delivery_date.split('/');
    if (parts.length < 2) return parseInt(yyyy + mmFromUrl + '00', 10);
    const m = String(parseInt(parts[0], 10)).padStart(2, '0');
    const d = String(parseInt(parts[1], 10)).padStart(2, '0');
    return parseInt(yyyy + m + d, 10);
  }

  // ----------------------------------------
  // program.updated ("M/D" 形式) を yyyymmdd 数値に変換
  // 現在年を基準にし、300日超の未来なら前年とみなす
  // ----------------------------------------
  function getUpdatedDateNumber(updated) {
    if (!updated) return null;
    const parts = updated.split('/');
    if (parts.length < 2) return null;
    const m = String(parseInt(parts[0], 10)).padStart(2, '0');
    const d = String(parseInt(parts[1], 10)).padStart(2, '0');
    const now = new Date();
    let yyyy = String(now.getFullYear());
    const candidateNum = parseInt(yyyy + m + d, 10);
    const nowNum = parseInt(
      String(now.getFullYear()) +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0'),
      10
    );
    if (candidateNum > nowNum + 300) {
      yyyy = String(now.getFullYear() - 1);
    }
    return parseInt(yyyy + m + d, 10);
  }

  // ----------------------------------------
  // program.contents から最新日を取得。
  // 取れない場合は program.updated にフォールバック。
  // ----------------------------------------
  function getLatestDate(program) {
    if (Array.isArray(program.contents) && program.contents.length > 0) {
      let maxDate = null;
      for (const content of program.contents) {
        const dateNum = getContentDateNumber(content);
        if (dateNum && (!maxDate || dateNum > maxDate)) {
          maxDate = dateNum;
        }
      }
      if (maxDate) return maxDate;
    }
    return getUpdatedDateNumber(program.updated);
  }

  // ----------------------------------------
  // API データ取得
  // ----------------------------------------
  function fetchPrograms() {
    if (programMapCache) {
      return Promise.resolve(programMapCache);
    }
    if (apiLoading) {
      return new Promise((resolve) => {
        const timer = setInterval(() => {
          if (programMapCache) {
            clearInterval(timer);
            resolve(programMapCache);
          }
        }, 100);
      });
    }
    apiLoading = true;
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: API_URL,
        onload: function (response) {
          try {
            const programs = JSON.parse(response.responseText);
            const map = {};
            programs.forEach(program => {
              map[program.directory_name] = program;
            });
            programMapCache = map;
            apiLoading = false;
            resolve(map);
          } catch (e) {
            apiLoading = false;
            reject(e);
          }
        },
        onerror: function (e) {
          apiLoading = false;
          reject(e);
        }
      });
    });
  }

  // ----------------------------------------
  // 元の並び順を記録
  // ----------------------------------------
  function ensureOriginalOrder(list) {
    const items = Array.from(list.children);
    items.forEach((item, index) => {
      if (!item.dataset.onsenOriginalIndex) {
        item.dataset.onsenOriginalIndex = String(index);
      }
    });
  }

  // ----------------------------------------
  // 各要素に更新日を記録
  // ----------------------------------------
  function attachUpdateDates(list, programMap) {
    const items = Array.from(list.children);
    items.forEach(item => {
      const dirName = getDirectoryNameFromItem(item);
      let dateNum = null;
      if (dirName && programMap[dirName]) {
        dateNum = getLatestDate(programMap[dirName]);
      }
      item.dataset.onsenUpdateDate = dateNum ? String(dateNum) : '';
      if (dirName) {
        item.dataset.directoryName = dirName;
      }
    });
  }

  // ----------------------------------------
  // 並び替え
  // ----------------------------------------
  function sortListByMode(list, mode) {
    const items = Array.from(list.children);
    if (items.length === 0) return false;

    const sorted = items.slice().sort((a, b) => {
      const originalA = parseInt(a.dataset.onsenOriginalIndex || '0', 10);
      const originalB = parseInt(b.dataset.onsenOriginalIndex || '0', 10);

      if (mode === SORT_MODE.ORIGINAL) {
        return originalA - originalB;
      }

      if (mode === SORT_MODE.REVERSED) {
        return originalB - originalA;
      }

      if (mode === SORT_MODE.UPDATED) {
        const dateA = parseInt(a.dataset.onsenUpdateDate || '0', 10);
        const dateB = parseInt(b.dataset.onsenUpdateDate || '0', 10);
        if (dateA && dateB && dateA !== dateB) {
          return dateB - dateA;
        }
        if (dateA && !dateB) return -1;
        if (!dateA && dateB) return 1;
        return originalA - originalB;
      }

      return 0;
    });

    sorted.forEach(item => list.appendChild(item));
    list.dataset.onsenSortMode = mode;
    console.log(`[音泉並び替え] ${MODE_LABEL[mode]} にしました`);
    return true;
  }

  // ----------------------------------------
  // ボタン表示/非表示切替
  // ----------------------------------------
  function updateButtonVisibility() {
    const btn = document.querySelector('#onsen-sort-toggle-btn');
    if (!btn) return;
    btn.style.display = isFavTabVisible() ? 'block' : 'none';
  }

  // ----------------------------------------
  // ボタン表示更新
  // ----------------------------------------
  function updateButtonState() {
    const btn = document.querySelector('#onsen-sort-toggle-btn');
    if (!btn) return;
    btn.textContent = `ソート: ${MODE_LABEL[sortMode]}`;
    const colorMap = {
      [SORT_MODE.ORIGINAL]: '#607d8b',
      [SORT_MODE.UPDATED]:  '#ff6b35',
      [SORT_MODE.REVERSED]: '#e85d87',
    };
    btn.style.backgroundColor = colorMap[sortMode];
    updateButtonVisibility();
  }

  // ----------------------------------------
  // 適用本体
  // ----------------------------------------
  async function applySort() {
    const list = getList();
    if (!list) return false;

    ensureOriginalOrder(list);

    if (sortMode === SORT_MODE.ORIGINAL || sortMode === SORT_MODE.REVERSED) {
      sortListByMode(list, sortMode);
      updateButtonState();
      return true;
    }

    try {
      const programMap = await fetchPrograms();
      attachUpdateDates(list, programMap);
      sortListByMode(list, sortMode);
      updateButtonState();
      return true;
    } catch (e) {
      console.error('[音泉並び替え] API取得エラー', e);
      return false;
    }
  }

  // ----------------------------------------
  // 遅延適用（DOM構築待ち）
  // ----------------------------------------
  function scheduleApply(delay = 300) {
    clearTimeout(applyTimer);
    applyTimer = setTimeout(() => {
      if (isFavTabVisible()) {
        applySort();
      }
    }, delay);
  }

  // ----------------------------------------
  // モード切替
  // original → updated → reversed → original
  // ----------------------------------------
  function nextMode(currentMode) {
    if (currentMode === SORT_MODE.ORIGINAL) return SORT_MODE.UPDATED;
    if (currentMode === SORT_MODE.UPDATED)  return SORT_MODE.REVERSED;
    return SORT_MODE.ORIGINAL;
  }

  // ----------------------------------------
  // MutationObserver でDOM変化を監視
  // ----------------------------------------
  function startObserver() {
    if (observer) observer.disconnect();
    observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        // 既存タブの style 変化（display切替）を検知
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'style'
        ) {
          updateButtonVisibility();
          if (isFavTabVisible()) scheduleApply(400);
          return;
        }

        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (
                node.id === 'category-video' ||
                node.querySelector?.('#category-video') ||
                node.id === 'inner-tab1C' ||
                node.closest?.('#category-video')
              ) {
                scheduleApply(400);
                updateButtonVisibility();
                return;
              }
            }
          }
        }
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style'],
    });
  }

  // ----------------------------------------
  // トグルボタン作成
  // ----------------------------------------
  function createToggleButton() {
    if (document.querySelector('#onsen-sort-toggle-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'onsen-sort-toggle-btn';
    Object.assign(btn.style, {
      position:        'fixed',
      bottom:          '20px',
      right:           '20px',
      zIndex:          '9999',
      padding:         '10px 16px',
      borderRadius:    '999px',
      border:          'none',
      cursor:          'pointer',
      fontSize:        '13px',
      fontWeight:      'bold',
      boxShadow:       '0 2px 8px rgba(0,0,0,0.3)',
      transition:      'background 0.2s, color 0.2s, opacity 0.2s',
      color:           '#fff',
      display:         'none',
    });
    btn.addEventListener('click', async () => {
      sortMode = nextMode(sortMode);
      localStorage.setItem(STORAGE_KEY_MODE, sortMode);
      updateButtonState();
      await applySort();
    });
    document.body.appendChild(btn);
    updateButtonState();
  }

  // ----------------------------------------
  // 初期化
  // ----------------------------------------
  function init() {
    createToggleButton();
    startObserver();
    scheduleApply(500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();