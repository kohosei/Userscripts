// ==UserScript==
// @name         Hide comments and live chat on YouTube
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  YouTubeのコメント欄とライブチャット欄を非表示
// @match        https://www.youtube.com/*
// @match        http://www.youtube.com/*
// @match        https://youtube.com/*
// @match        http://youtube.com/*
// @updateURL    https://raw.githubusercontent.com/kohosei/Userscripts/main/yt_comments_hide.js
// @downloadURL  https://raw.githubusercontent.com/kohosei/Userscripts/main/yt_comments_hide.js
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const css = `
    /* 動画ページのコメント欄を非表示 */
    #comments,
    ytd-comments,
    ytd-item-section-renderer#sections {
      display: none !important;
    }

    /* ライブ配信のチャット欄を非表示 */
    #chat,
    #chat-container,
    ytd-live-chat-frame,
    ytd-live-chat-frame #contents,
    ytd-live-chat-frame #item-scroller {
      display: none !important;
    }

    /* シアターモードなどで右側に出るチャットも念のため */
    ytd-watch-flexy[theater] #chat,
    ytd-watch-flexy[theater] #chat-container {
      display: none !important;
    }
  `;

  if (typeof GM_addStyle !== 'undefined') {
    GM_addStyle(css);
  } else {
    const style = document.createElement('style');
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }
})();
