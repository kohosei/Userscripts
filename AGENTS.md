# 🤖 AI Agent Guidelines & Development Manual for Userscripts

このドキュメントは、本リポジトリで作業を行うすべての AI エージェントおよび開発者が遵守すべきルール、設計原則、テスト手順、運用フローを定義したマスターガイドです。

---

## 🎯 プロジェクト概要 & AI エージェントの役割
- **プロジェクト名**: Userscripts (Safari iOS/macOS ユーザースクリプト & スタイル集)
- **対象プラットフォーム**:
  - **Safari 拡張機能「Userscripts」** (iOS / iPadOS / macOS - [quoid/userscripts](https://github.com/quoid/userscripts))
  - **Tampermonkey** (Chrome / Safari / Firefox / Edge 等)
- **主言語 / ランタイム**: JavaScript (ES2020+), CSS (CSS3), Node.js v23+
- **AI エージェントの責務**:
  - Tampermonkey および Safari Userscripts の**両環境で完全な互換性を持つ**ユーザースクリプト（JS）とカスタムスタイル（CSS/JS）を作成・保守する専門アシスタントです。
  - ユーザーから「対象のサイト」「やりたいこと」「言語（JSまたはCSS）」の要件を受け取り、公式仕様に完全に準拠したメタデータと本体コードを生成・更新します。
  - ユーザーへの挨拶や余分な解説は最小限に留め、正確でそのまま実用可能なコードの出力を最優先します。

---

## ⚠️ リポジトリ構造と特殊運用ルール (CRITICAL)

本リポジトリは、**「iOS 端末への iCloud リアルタイム同期」** と **「破損リスクのない堅牢な Git バージョン管理」** を両立するため、Git 標準の `--separate-git-dir` 方式を採用しています。

```
[iCloud Drive (iOS同期領域 / ワークツリー)]
/Users/user/Library/Mobile Documents/com~apple~CloudDocs/Userscripts/
  ├── .git (テキストファイル: gitdir: /Users/user/_Costom_Local_User_Folder/_Antigravity/userscripts.git を指す)
  ├── .gitignore
  ├── AGENTS.md
  ├── README.md
  └── *.js, *.css (スクリプト本体群)

[ローカルストレージ (Git管理領域 / 実体)]
/Users/user/_Costom_Local_User_Folder/_Antigravity/userscripts.git/
  └── (HEAD, refs, objects, index などのGit実体)
```

### AI エージェントが厳守すべき制約
1. **`.git` ポインタファイルの保護**:
   - ワークツリー直下の `.git` はフォルダではなく、ローカル Git ディレクトリへのパスが書かれたテキストファイルです。絶対に削除・上書きしないでください。
2. **iCloud 即時反映への配慮**:
   - ワークツリー内のファイルを保存・編集すると、iCloud Drive を経由して**数秒以内にユーザーの iOS 端末（Safari）へ同期**されます。
   - そのため、構文エラーを含む壊れた状態のファイルを放置しないでください。
   - トピックブランチで作業する際も、ワークツリーが切り替われば iOS 端末側にも反映されるため、作業中であっても構文整合性を維持してください。

---

## 🔬 両プラットフォームの最新仕様 & 互換性の検証知見

Tampermonkey および Safari Userscripts (`quoid/userscripts`) の公式最新ドキュメントに基づく重要仕様です。

### 1. CSS（スタイルシート）の互換性の壁と解決策
- **Tampermonkey の仕様**:
  - Tampermonkey はスクリプトマネージャであり、`.css` や `/* ==UserStyle== */` の**プレーンCSSファイルを直接読み込む機能はありません**。
  - Tampermonkey でスタイルを適用する場合は、ユーザースクリプト (`.js`) 内で `GM_addStyle` や `<style>` 要素の挿入を行う必要があります。
- **Safari Userscripts (`quoid/userscripts`) の仕様**:
  - 過去に独自の `/* ==UserStyle== */` をサポートしていましたが、公式開発において非推奨・廃止傾向にあり、作者（quoid氏）自身が**「`==UserStyle==` ではなく、標準ユーザースクリプトとして `GM.addStyle(css)` / `GM_addStyle(css)` を使うこと」を公式に推奨**しています。
- **💡 互換性のベストプラクティス**:
  - **【両環境完全互換（推奨）】**: スタイル適用であっても、**JavaScript 形式（`GM_addStyle` またはフォールバック付きスタイル注入）で記述した `.js`** を生成する。これにより Tampermonkey と Safari Userscripts の両方で100%同一コードで動作します。
  - **【Safari Userscripts 専用】**: ユーザーが単体の `.css` ファイルとしての出力を希望した場合のみ、Safari Userscripts 専用の `/* ==UserStyle== */` 形式で出力する（Tampermonkey では動作しない旨を明記）。

### 2. URL マッチング仕様
- **`@match` の統一使用**:
  - Safari Userscripts では `@include` や `@exclude` は非推奨（Deprecated）化されており、`@match` および `@exclude-match` のみが正式サポートされています。
  - スキームは `http://` または `https://`（あるいはワイルドカード `*://`）のみ使用可能です。
- **`@namespace`**:
  - Tampermonkey ではスクリプトの一意性識別のために推奨されます。Safari Userscripts では無視されますが、害はないため常に記述します。

### 3. `@name` の命名規則
- Safari Userscripts では `@name` がそのまま**ファイル名および UI 表示名**として使用されます。
- ファイルシステムで不正となる文字（`/`, `\`, `:`, `*`, `?`, `"`, `<`, `>`, `|`）は絶対に含めず、**英数字・ハイフン・アンダースコア・半角空白**を基本としてください。

---

## 📐 スクリプト & スタイル実装規範・メタデータ生成仕様

### 1. JavaScript (DOM操作・機能拡張)
- **グローバル汚染防止**: 即時実行関数式（IIFE）かつ `'use strict';` で記述。
- **遅延ロード / SPA 対応**:
  - 対象要素が即座に存在しない場合に備え、`MutationObserver` または `document.readyState` 待機処理を組み込む。
- **権限設定**:
  - 特殊API（GM_*）を使用しない場合は `@grant none` を明記してサンドボックスオーバーヘッドを回避。

```javascript
// ==UserScript==
// @name         [スクリプト名（英数字推奨）]
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  [スクリプトの説明]
// @match        [対象サイトのURLパターン（例: https://example.com/*）]
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 遅延ロード対応の要素監視例
    const observer = new MutationObserver(() => {
        const target = document.querySelector('.target-selector');
        if (target) {
            // 処理実行
            observer.disconnect();
        }
    });

    observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true
    });
})();
```

---

### 2. カスタムスタイル (両環境完全互換形式: JavaScript + GM_addStyle) 【推奨】
Tampermonkey と Safari Userscripts の両方で確実にスタイルを適用するための完全互換形式です。

```javascript
// ==UserScript==
// @name         [スタイル名（英数字推奨）]
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  [スタイルの説明]
// @match        [対象サイトのURLパターン（例: https://example.com/*）]
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        .unwanted-element {
            display: none !important;
        }
    `;

    // GM_addStyle または DOM注入のフォールバック
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
    }
})();
```

---

### 3. カスタムスタイル (Safari Userscripts 専用: .css / .user.css)
Safari Userscripts の独自機能を利用した単体 CSS ファイルです（Tampermonkey では動作しません）。

> [!WARNING]
> - `@run-at` や `@inject-into` は JavaScript 専用メタデータです。**CSS には絶対に含めないでください**。
> - `@include` は非推奨です。必ず **`@match`** を使用してください。

```css
/* ==UserStyle==
@name          [スタイル名（英数字推奨）]
@version       1.0
@description   [スタイルの説明]
@match         https://example.com/*
==/UserStyle== */

.unwanted-element {
    display: none !important;
}
```

---

## 🌳 Git ブランチ戦略 & 運用プロトコル (Modified Git-flow)

本リポジトリでは安全な自動開発のため **Modified Git-flow** を採用します。

### 1. ブランチ役割
| ブランチ | 役割 | 直接コミット | マージ元 | マージ方法 |
| :--- | :--- | :---: | :--- | :--- |
| `main` | 安定版（iOS 端末で安定稼働する確定コード） | ❌ 禁止 | `develop` | `--no-ff` |
| `develop` | 開発統合ブランチ（常時構文検査通過状態） | ❌ 禁止 | トピックブランチ | `--no-ff` |
| `<type>/*` | 個別作業トピックブランチ | ⭕ 可 | `develop` | - |

- **プレフィックス (`type`)**:
  - `feature/`: 新規スクリプト・スタイル追加、機能拡張
  - `fix/`: セレクタ変更対応、不具合修正、DOM遅延対応
  - `refactor/`: リファクタリング
  - `test/`: 検査コマンド・テスト追加
  - `chore/`: 設定ファイル・`.gitignore` 更新
  - `docs/`: ドキュメント・スクリプトカタログ更新

---

### 2. 🤖 AI エージェント自律開発手順 (Autonomous Protocol)

AI エージェントは、ユーザーからタスクを指示された際、以下のステップを順次実行してください。

1. **Pre-flight (作業前確認)**:
   ```bash
   git status --porcelain
   # 作業ツリーが clean であることを確認
   git checkout develop
   ```
2. **Branch (トピックブランチ作成)**:
   ```bash
   git checkout -b <type>/<kebab-case-name>
   ```
3. **Implementation (実装)**:
   - 既存機能を破壊しないよう慎重に実装する。
   - 上記のメタデータ仕様（`@name`, `@match` 等）および実装規範（遅延ロード、詳細度）を厳守する。
4. **Quality Gate (自動検査)**:
   - **コミット前に必ず後述の自動検査コマンドを全件パス**させる。
   ```bash
   node --check *.js
   ```
5. **Integrate (コミット & マージ)**:
   ```bash
   git add .
   git commit -m "<type>(<scope>): <変更内容の要約>"
   git checkout develop
   git merge --no-ff <type>/<kebab-case-name> -m "Merge branch '<type>/<kebab-case-name>' into develop"
   git branch -d <type>/<kebab-case-name>
   ```
   ※本番反映（`main` へのマージ）は、ユーザーの指示またはリリース判断時に `--no-ff` でマージします。

---

## 🛡️ 品質ゲート (Quality Gate) & 自動検査コマンド

コミット前に必ず以下のコマンドを実行し、エラーがゼロであることを確認してください。

### 1. JavaScript 構文検査
リポジトリ内の全 `.js` ファイルに対して Node.js の組み込み構文チェッカーを実行します。
```bash
node --check *.js
```
*(エラーが発生した場合は該当ファイルの行番号とシンタックスエラーを修正するまでコミット禁止)*

### 2. メタデータヘッダー検査
スクリプトにヘッダーが欠落していないか確認します。
- `.js` ファイル: `grep -L "==UserScript==" *.js` の出力が空であること
- `.css` ファイル: `grep -L "==UserStyle==" *.css` の出力が空であること
- CSS専用検査: `grep -E "@run-at|@inject-into" *.css` の出力が空であること（CSSへのJS用メタデータ混入防止）

---

## 📚 ドキュメント & スクリプト管理

### 管理場所
- `AGENTS.md`: 本ガイド（開発・運用マニュアル）
- `README.md`: スクリプト一覧・対象サイト・役割のカタログ

### スクリプト追加・変更時の義務
新しいスクリプトやスタイルを追加、またはセレクタ変更等の大幅な仕様変更を行った場合は、`README.md` のカタログにも反映してください。
