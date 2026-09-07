// ==UserScript==
// @name         InstagramLiveCommentHider_Reply_Fix
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Instagram Liveのコメント欄（返信含む）や関連UIを非表示にするスクリプト（安定版）
// @match        https://www.instagram.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const hideComments = () => {
        // span, button, div の中から、さらに他の要素を含まない「一番端っこのテキスト要素」だけを狙う
        const nodes = document.querySelectorAll("span, button, div");

        nodes.forEach(el => {
            // 子要素を持つ大きなブロックは無視して誤爆（真っ黒になる現象）を防ぐ
            if (el.children.length > 0) return;

            const txt = (el.textContent || "").replace(/\s+/g, " ").trim();

            if (
                txt &&
                txt.length < 50 && // 誤爆防止のため文字数制限を厳しく（50文字未満）
                txt.includes("返信") &&
                !txt.includes("コメントを追加") &&
                !txt.includes("ライブ配信をシェア")
            ) {
                // コメントの親要素を特定して非表示にする（li要素か、少し上の親div要素）
                const target = el.closest("li") || el.parentElement.parentElement;
                
                // 念のため、画面全体を消さないように安全装置
                if (target && target.tagName !== 'BODY' && target.tagName !== 'HTML') {
                    target.style.setProperty("display", "none", "important");
                }
            }
        });

        // コメント入力欄の非表示
        const textareas = document.querySelectorAll("textarea");
        textareas.forEach(ta => {
            if ((ta.placeholder || "").includes("コメント")) {
                const form = ta.closest("form");
                if (form) form.style.setProperty("display", "none", "important");
            }
        });
    };

    // 連続実行を防ぐための間引き処理（デバウンス）
    let timeoutId;
    const applyWithDebounce = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            hideComments();
        }, 300); // 300ミリ秒まとめて1回だけ実行して負荷を下げる
    };

    // 初回実行
    applyWithDebounce();

    // DOM変更の監視（遅延ロード対応）
    const observer = new MutationObserver(() => {
        applyWithDebounce();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();