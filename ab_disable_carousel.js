// ==UserScript==
// @name         Disable Carousel Autoplay (Apollo Bay Cruiser)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Apollo Bay Cruiserのトップページでカルーセルの自動スクロールを無効化します
// @match        https://apollobaycruiser.jp/
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 1. Swiperコンストラクタをインターセプトして autoplay を無効化
    const timer = setInterval(() => {
        if (typeof window.Swiper !== "function") return;

        const OriginalSwiper = window.Swiper;

        function SwiperWithoutAutoplay(...args) {
            const optionsIndex = 1;
            args[optionsIndex] = {
                ...(args[optionsIndex] || {}),
                autoplay: false,
            };

            return Reflect.construct(OriginalSwiper, args, OriginalSwiper);
        }

        Object.setPrototypeOf(SwiperWithoutAutoplay, OriginalSwiper);
        SwiperWithoutAutoplay.prototype = OriginalSwiper.prototype;
        window.Swiper = SwiperWithoutAutoplay;

        clearInterval(timer);
    }, 10);

    // 2. 既に生成済みのSwiperインスタンスが存在する場合のフォールバック処理
    window.addEventListener('DOMContentLoaded', () => {
        const stopExistingAutoplay = () => {
            const swiperElements = document.querySelectorAll('.swiper, .swiper-container');
            swiperElements.forEach(el => {
                if (el.swiper && el.swiper.autoplay && el.swiper.autoplay.running) {
                    el.swiper.autoplay.stop();
                }
            });
        };

        stopExistingAutoplay();

        // 遅延生成された要素に対する監視処理
        const observer = new MutationObserver(() => {
            stopExistingAutoplay();
        });

        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        }
    });
})();