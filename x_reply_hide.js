// ==UserScript==
// @name         Hide_X_Replies
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  x.comのツイート詳細ページでリプライ欄を非表示にする（投稿者自身のリプライは表示）
// @match        https://x.com/*
// @match        https://twitter.com/*
// @updateURL    https://raw.githubusercontent.com/kohosei/Userscripts/main/x_reply_hide.js
// @downloadURL  https://raw.githubusercontent.com/kohosei/Userscripts/main/x_reply_hide.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // --- CSS による即時非表示 ---
    // CSS兄弟セレクタを使い、マーカーセル以降のセルを自動的に非表示にする。
    // これにより、新しいリプライセルがDOMに追加された瞬間にCSSで非表示になり、
    // JSの実行を待つ必要がないためちらつきが発生しない。
    // 投稿者自身のリプライには .x-author-reply クラスを付与して表示する。
    const style = document.createElement('style');
    style.textContent = `
        [data-testid="cellInnerDiv"].x-replies-boundary ~ [data-testid="cellInnerDiv"]:not(.x-author-reply) {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    // --- リプライ非表示ロジック ---

    function processReplies() {
        // ツイート詳細ページでない場合はスキップ
        if (!/\/status\/\d+/.test(location.pathname)) return;

        // メインタイムラインのカラムを取得
        const primaryColumn = document.querySelector(
            '[data-testid="primaryColumn"]'
        );
        if (!primaryColumn) return;

        // cellInnerDiv 要素を全て取得
        const cells = primaryColumn.querySelectorAll(
            '[data-testid="cellInnerDiv"]'
        );
        if (cells.length === 0) return;

        // 既にマーカーが設定済みかチェック
        const existingMarker = primaryColumn.querySelector(
            '[data-testid="cellInnerDiv"].x-replies-boundary'
        );

        let mainTweetActionBarIndex = -1;

        if (existingMarker) {
            // マーカーが既にある場合、そのインデックスを取得
            for (let i = 0; i < cells.length; i++) {
                if (cells[i] === existingMarker) {
                    mainTweetActionBarIndex = i;
                    break;
                }
            }
        } else {
            // マーカーがない場合、メインツイートのアクションバーを探す
            mainTweetActionBarIndex = findActionBarIndex(cells);

            if (mainTweetActionBarIndex === -1) return;

            // アクションバーのセルにマーカークラスを付与
            // このクラスが付いた瞬間、CSSの兄弟セレクタにより
            // 後続のセルが自動的に非表示になる
            cells[mainTweetActionBarIndex].classList.add('x-replies-boundary');
        }

        if (mainTweetActionBarIndex === -1) return;

        // 投稿者自身のリプライを表示するための処理
        const pathMatch = location.pathname.match(/^\/([^/]+)\/status\//);
        const mainAuthor = pathMatch ? pathMatch[1].toLowerCase() : null;

        if (!mainAuthor) return;

        // マーカー以降のセルをチェックし、投稿者自身のリプライに
        // .x-author-reply クラスを付与して表示する
        for (let i = mainTweetActionBarIndex + 1; i < cells.length; i++) {
            // 既に処理済みのセルはスキップ
            if (cells[i].hasAttribute('data-x-reply-checked')) continue;

            cells[i].setAttribute('data-x-reply-checked', '1');

            if (isReplyFromAuthor(cells[i], mainAuthor)) {
                cells[i].classList.add('x-author-reply');
            }
        }
    }

    /**
     * メインツイートのアクションバーを含む cellInnerDiv のインデックスを返す
     */
    function findActionBarIndex(cells) {
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];

            const hasActionGroup = cell.querySelector('[role="group"]');
            const hasLike = cell.querySelector(
                '[data-testid="like"], [data-testid="unlike"]'
            );
            const hasRetweet = cell.querySelector(
                '[data-testid="retweet"], [data-testid="unretweet"]'
            );

            if (hasActionGroup && hasLike && hasRetweet) {
                const timeInCell = cell.querySelector('time');
                const timeInPrevCell = i > 0 && cells[i - 1].querySelector('time');

                if (timeInCell || timeInPrevCell) {
                    return i;
                }
            }
        }

        // フォールバック: 返信入力欄から推定
        for (let i = 0; i < cells.length; i++) {
            const hasReplyBox = cells[i].querySelector(
                '[data-testid="tweetTextarea_0"], [data-testid="tweetTextarea_0_label"]'
            );
            if (hasReplyBox) {
                return i - 1;
            }
        }

        return -1;
    }

    /**
     * セル内のリプライが指定ユーザーによるものかを判定する
     */
    function isReplyFromAuthor(cell, authorUsername) {
        const article = cell.querySelector('article');
        if (!article) return false;

        const userLinks = article.querySelectorAll('a[href^="/"]');
        for (const link of userLinks) {
            const href = link.getAttribute('href');
            if (href && /^\/[^/]+$/.test(href)) {
                const linkUser = href.slice(1).toLowerCase();
                if (linkUser === authorUsername) {
                    return true;
                }
                return false;
            }
        }
        return false;
    }

    // --- 監視と実行 ---
    let lastUrl = '';

    function onUrlChange() {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            // SPA遷移時にマーカーとフラグをリセット
            document.querySelectorAll('.x-replies-boundary').forEach(el => {
                el.classList.remove('x-replies-boundary');
            });
            document.querySelectorAll('.x-author-reply').forEach(el => {
                el.classList.remove('x-author-reply');
            });
            document.querySelectorAll('[data-x-reply-checked]').forEach(el => {
                el.removeAttribute('data-x-reply-checked');
            });
        }
    }

    // MutationObserver: 同期的に processReplies() を呼ぶことで
    // セルが描画される前に非表示処理を完了する
    const observer = new MutationObserver((mutations) => {
        onUrlChange();

        if (!/\/status\/\d+/.test(location.pathname)) return;

        // 関連するDOM変更があった場合のみ処理
        let shouldProcess = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== 1) continue;
                    if (
                        node.matches?.('[data-testid="cellInnerDiv"]') ||
                        node.querySelector?.('[data-testid="cellInnerDiv"]') ||
                        node.closest?.('[data-testid="cellInnerDiv"]') ||
                        node.querySelector?.('article')
                    ) {
                        shouldProcess = true;
                        break;
                    }
                }
            }
            if (shouldProcess) break;
        }

        if (shouldProcess) {
            // 同期実行: MutationObserverのコールバックはレンダリング前に実行されるため、
            // ここで処理すればちらつきは発生しない
            processReplies();
        }
    });

    function init() {
        observer.observe(document.body, { childList: true, subtree: true });
        lastUrl = location.href;
        processReplies();
    }

    if (document.body) {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

    console.log('[Hide_X_Replies] リプライ非表示スクリプト v3.0 を開始しました');
})();