// ==UserScript==
// @name         Hide selected elements on lovelive-liellaclub.jp
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  mekuliella_caption と footer の link_text を非表示
// @match        https://lovelive-liellaclub.jp/*
// @match        http://lovelive-liellaclub.jp/*
// @updateURL    https://raw.githubusercontent.com/kohosei/Userscripts/main/liellaclub_caption_footer_hide.js
// @downloadURL  https://raw.githubusercontent.com/kohosei/Userscripts/main/liellaclub_caption_footer_hide.js
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const css = `
    #mekuliella_content > div.mekuliella_caption {
      display: none !important;
    }

    footer > ul.link_text {
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
