// ==UserScript==
// @name         apollobaycruiser auto open login
// @match        https://apollobaycruiser.jp/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const link = document.querySelector('li.nav--login a');
  if (!link) return;

  const href = link.getAttribute('href');
  if (!href) return;

  location.href = href;
})();