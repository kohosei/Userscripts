// ==UserScript==
// @name         Disable Carousel Autoplay (Apollo Bay Cruiser)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Apollo Bay Cruiserのトップページでカルーセルの自動スクロールを無効化します（ログイン後遷移・BFCache完全対応）
// @match        https://apollobaycruiser.jp/*
// @updateURL    https://raw.githubusercontent.com/kohosei/Userscripts/main/ab_disable_carousel.js
// @downloadURL  https://raw.githubusercontent.com/kohosei/Userscripts/main/ab_disable_carousel.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    function wrapSwiper(OriginalSwiper) {
        if (!OriginalSwiper || OriginalSwiper._isWrappedWithoutAutoplay) {
            return OriginalSwiper;
        }

        function SwiperWithoutAutoplay(...args) {
            const optionsIndex = 1;
            args[optionsIndex] = {
                ...(args[optionsIndex] || {}),
                autoplay: false,
            };

            const instance = Reflect.construct(OriginalSwiper, args, OriginalSwiper);
            try {
                if (instance && instance.autoplay && typeof instance.autoplay.stop === 'function') {
                    instance.autoplay.stop();
                }
            } catch (e) {}
            return instance;
        }

        Object.setPrototypeOf(SwiperWithoutAutoplay, OriginalSwiper);
        SwiperWithoutAutoplay.prototype = OriginalSwiper.prototype;
        SwiperWithoutAutoplay._isWrappedWithoutAutoplay = true;

        return SwiperWithoutAutoplay;
    }

    // 1. window.Swiper の即時インターセプト (defineProperty + ポーリング)
    let internalSwiper = window.Swiper;
    if (internalSwiper) {
        window.Swiper = wrapSwiper(internalSwiper);
    } else {
        try {
            Object.defineProperty(window, 'Swiper', {
                configurable: true,
                enumerable: true,
                get() {
                    return internalSwiper;
                },
                set(val) {
                    internalSwiper = wrapSwiper(val);
                }
            });
        } catch (e) {
            // defineProperty が失敗した環境へのフォールバック
        }
    }

    // 念のため初期数秒間 Swiper が代入されたか確認
    const hookTimer = setInterval(() => {
        if (typeof window.Swiper === 'function' && !window.Swiper._isWrappedWithoutAutoplay) {
            window.Swiper = wrapSwiper(window.Swiper);
        }
    }, 20);
    setTimeout(() => clearInterval(hookTimer), 5000);

    // 2. 既存・遅延生成されたSwiperインスタンスの強制停止
    const stopAllCarousels = () => {
        // 対象サイトでは new Swiper('.section--banner', ...) として初期化される
        const targets = document.querySelectorAll('.section--banner, .swiper, .swiper-container, [class*="swiper"]');
        targets.forEach(el => {
            if (el.swiper) {
                try {
                    if (el.swiper.params) {
                        el.swiper.params.autoplay = false;
                    }
                    if (el.swiper.autoplay && typeof el.swiper.autoplay.stop === 'function') {
                        el.swiper.autoplay.stop();
                    }
                } catch (e) {}
            }
        });

        // プログレスバーのアニメーション進行を停止
        const progressBar = document.querySelector('.section--banner .progress-bar p');
        if (progressBar && progressBar.style.animationPlayState !== 'paused') {
            progressBar.style.transitionDuration = '0s';
            progressBar.style.transform = 'scaleX(0)';
        }
    };

    // 3. ページライフサイクルに応じた多重実行
    stopAllCarousels();

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', stopAllCarousels);
    } else {
        stopAllCarousels();
    }

    window.addEventListener('load', stopAllCarousels);

    // ログイン画面からのリダイレクトやブラウザバック (BFCache) 復帰に対応
    window.addEventListener('pageshow', () => {
        stopAllCarousels();
    });

    // 遅延生成・スクリプト初期化に対応する監視処理
    const initObserver = () => {
        const root = document.body || document.documentElement;
        if (!root) return;

        const observer = new MutationObserver(() => {
            stopAllCarousels();
        });

        observer.observe(root, { childList: true, subtree: true });
        setTimeout(() => observer.disconnect(), 10000);
    };

    if (document.body || document.documentElement) {
        initObserver();
    } else {
        window.addEventListener('DOMContentLoaded', initObserver);
    }

    // 初期ロード直後の非同期初期化に備えて短時間ポーリング
    const checkInterval = setInterval(stopAllCarousels, 200);
    setTimeout(() => clearInterval(checkInterval), 3000);
})();
