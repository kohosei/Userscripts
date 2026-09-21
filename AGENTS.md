# 🤖 AI Agent Guidelines & Development Manual for Userscripts

このドキュメントは、本リポジトリで作業を行うすべての AI エージェントおよび開発者が遵守すべきマスターガイドです。
今後の機能改修、バグ修正、新規スクリプト・スタイルの追加において、**一言一句の逸脱なく本プロトコルを遵守**してください。

---

## 🎯 プロジェクト概要 & AI エージェントの役割
- **プロジェクト名**: Userscripts (Safari iOS/macOS ユーザースクリプト & スタイル集)
- **対象プラットフォーム**:
  - **Safari 拡張機能「Userscripts」** (iOS / iPadOS / macOS - [quoid/userscripts](https://github.com/quoid/userscripts))
  - **Tampermonkey** (Chrome / Safari / Firefox / Edge 等)
- **配信リポジトリ**: `https://github.com/kohosei/Userscripts` (Public)
- **主言語 / ランタイム**: JavaScript (ES2020+), Node.js v23+
- **AI エージェントの主要な責務**:
  - Tampermonkey（Chrome）および Safari Userscripts（iOS / Mac）の**両環境で 100% 互換動作するスクリプト（`.js`）** を作成・保守する。
  - スタイルシートも含め、すべて JavaScript（`GM_addStyle` 注入）形式で作成し、Stylus 等の別拡張機能に依存しない統一環境を維持する。
  - スクリプト追加・変更時には、Tampermonkey の自動更新（`@version`, `@updateURL`）および `README.md` カタログの整合性を自動で担保する。

---

## ⚠️ リポジトリ構造と特殊運用制約 (CRITICAL)

### 1. 分離 Git 管理 (`--separate-git-dir`)
本リポジトリは、**「iOS 端末への iCloud リアルタイム同期」** と **「破損リスクのない堅牢な Git バージョン管理」** を両立するため、Git 標準の `--separate-git-dir` 方式を採用しています。

```
[iCloud Drive (iOS同期領域 / ワークツリー)]
/Users/user/Library/Mobile Documents/com~apple~CloudDocs/Userscripts/
  ├── .git (テキストファイル: gitdir: /Users/user/_Costom_Local_User_Folder/_Antigravity/userscripts.git を指す)
  ├── .gitignore
  ├── AGENTS.md
  ├── README.md
  └── *.js (スクリプト本体群: 全て .js に一本化)

[ローカルストレージ (Git管理領域 / 実体)]
/Users/user/_Costom_Local_User_Folder/_Antigravity/userscripts.git/
  └── (HEAD, refs, objects, index などのGit実体)
```

- **`.git` ポインタファイルの保護**:
  - ワークツリー直下の `.git` はテキストファイルです。絶対に削除・上書きしないでください。
- **iCloud 即時反映への配慮**:
  - ワークツリー内のファイルを保存・編集すると、数秒以内にユーザーの iOS 端末（Safari）へ同期されます。
  - そのため、**構文エラーを含む壊れた状態のファイルを放置しないでください**。

### 2. macOS CommandLineTools Git の優先使用
macOS 環境では Xcode ライセンスプロンプトによる対話停止を防ぐため、Git コマンドを実行する際は必ず CommandLineTools パスを優先してください：
```bash
export PATH="/Library/Developer/CommandLineTools/usr/bin:$PATH"
```

---

## 📐 スクリプト実装仕様 & 必須メタデータヘッダー

すべてのスクリプトは拡張子 **`.js`** で作成します（プレーンな `.css` ファイルの新規作成は禁止です）。

### 1. メタデータヘッダー必須項目（全スクリプト共通）
Tampermonkey の自動更新および Safari Userscripts との完全互換のため、以下のメタデータが必須です。

| キー | 必須 | 設定内容・規則 |
| :--- | :---: | :--- |
| `// ==UserScript==` | 必須 | ヘッダー開始マーカー |
| `@name` | 必須 | スクリプトの表示名（英数字・記号・日本語可。ファイルシステム禁止文字 `/ \ : * ? " < > \|` は不可） |
| `@namespace` | 必須 | `http://tampermonkey.net/` |
| `@version` | 必須 | バージョン番号（例: `1.0`, `1.1`, `1.2.1`）。**改修時は必ず数値を繰り上げること** |
| `@description` | 必須 | スクリプトの役割を簡潔に記載 |
| `@match` | 必須 | 対象 URL パターン（`@include` は非推奨のため使用禁止。`https://example.com/*` 等） |
| `@updateURL` | 必須 | `https://raw.githubusercontent.com/kohosei/Userscripts/main/<ファイル名>.js` |
| `@downloadURL` | 必須 | `https://raw.githubusercontent.com/kohosei/Userscripts/main/<ファイル名>.js` |
| `@grant` | 必須 | 特殊権限。DOM操作のみは `none`、スタイル注入は `GM_addStyle` |
| `@run-at` | 必須 | 実行タイミング（DOM操作は `document-end` または `document-idle`、スタイルは `document-start`） |
| `// ==/UserScript==` | 必須 | ヘッダー終了マーカー |

---

### 2. テンプレート A: 機能拡張・DOM操作スクリプト
- グローバル汚染を防ぐため即時実行関数式（IIFE）かつ `'use strict';` で記述。
- SPA や遅延ロード要素に対応するため `MutationObserver` を組み込む。

```javascript
// ==UserScript==
// @name         スクリプト名
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  スクリプトの説明
// @match        https://example.com/*
// @updateURL    https://raw.githubusercontent.com/kohosei/Userscripts/main/[ファイル名].js
// @downloadURL  https://raw.githubusercontent.com/kohosei/Userscripts/main/[ファイル名].js
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  // 遅延ロード・SPA対応の監視
  const observer = new MutationObserver(() => {
    const target = document.querySelector('.target-selector');
    if (target) {
      // 処理を実行
      observer.disconnect();
    }
  });

  if (document.body || document.documentElement) {
    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true
    });
  }
})();
```

---

### 3. テンプレート B: カスタムスタイルスクリプト (Stylus 代替 / GM_addStyle)
- スタイルはすべてこの形式で作成します。
- `@run-at document-start` で DOM 生成直後に注入し、スタイルのチラつき（FOUC）を完全に防止します。
- `GM_addStyle` が未定義の環境（一部サンドボックス外）でも確実に動作するようフォールバック処理を同梱します。

```javascript
// ==UserScript==
// @name         スタイル名
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  スタイルの説明
// @match        https://example.com/*
// @updateURL    https://raw.githubusercontent.com/kohosei/Userscripts/main/[ファイル名].js
// @downloadURL  https://raw.githubusercontent.com/kohosei/Userscripts/main/[ファイル名].js
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const css = `
    .unwanted-element {
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
```

---

## 🤖 AI エージェント自律開発プロトコル (Autonomous Protocol)

ユーザーからタスクを指示された際、AI エージェントは以下のチェックリストを順次実行してください。

### 【ケース 1: 既存スクリプトを修正・改善する場合】
1. **Pre-flight**:
   ```bash
   export PATH="/Library/Developer/CommandLineTools/usr/bin:$PATH"
   git status --porcelain
   git checkout develop && git pull origin develop
   ```
2. **Branch**:
   ```bash
   git checkout -b fix/<script-name>-<short-description>
   ```
3. **Implementation**:
   - 既存の動作を壊さないよう修正。
   - 🚨 **最重要義務: `@version` を必ずインクリメントすること！**
     - 例: `1.0` → `1.1`、`1.2.1` → `1.2.2`
     - 数値を繰り上げないと、Tampermonkey が変更を検知できず他端末に自動配信されません。
4. **Quality Gate**: 自動検査を全件パスさせる（後述）。
5. **Integrate**:
   ```bash
   git add .
   git commit -m "fix(<scope>): <変更内容の要約>"
   git checkout develop
   git merge --no-ff fix/<script-name>-<short-description> -m "Merge branch 'fix/...' into develop"
   git branch -d fix/<script-name>-<short-description>
   ```
6. **Release (main マージ & push)**:
   - ユーザーから指示された場合、または作業完了の区切りで必ず `main` にマージして push します（Tampermonkey の参照先が `main` のため）。
   ```bash
   git checkout main
   git merge --no-ff develop -m "release: update <script-name>"
   git checkout develop
   git push origin develop main
   ```

---

### 【ケース 2: 新規スクリプトを追加する場合】
1. **Pre-flight & Branch**:
   - `git checkout -b feature/add-<script-name>`
2. **Implementation**:
   - 上記テンプレート A または B に従ってファイルを作成（拡張子 `.js`）。
   - メタデータ（`@name`, `@version 1.0`, `@match`, `@updateURL`, `@downloadURL`, `@grant`, `@run-at`）を漏れなく記述。
3. **README.md カタログへの追記 (必須)**:
   - `README.md` の該当テーブルに新スクリプトの情報を 1 行追加する。
   - カラム: `ファイル名`, `名称 (@name)`, `対象サイト (@match)`, `[Raw Link](...)`, `概要`
4. **Quality Gate**: 自動検査を全件パス。
5. **Integrate & Release**:
   - `develop` にマージ後、`main` に `--no-ff` マージして push。

---

## 🛡️ 品質ゲート (Quality Gate) & 自動検査コマンド

**コミット前に必ず以下のコマンドを実行し、全項目が OK であることを確認してください。**  
1 つでもエラーがある場合、コミットは禁止です。

### 検査ワンライナー（コピペ用）
```bash
node --check *.js && \
test -z "$(grep -L "==UserScript==" *.js)" && echo "✅ UserScript headers: OK" && \
test -z "$(grep -L "@updateURL" *.js)" && echo "✅ updateURL headers: OK" && \
test -z "$(grep -L "@version" *.js)" && echo "✅ version headers: OK" && \
echo "🎉 ALL QUALITY GATES PASSED!"
```

### 個別検査項目
1. **JavaScript 構文検査**: `node --check *.js` で全ファイルに構文エラーがないこと。
2. **ヘッダー必須項目検査**:
   - `grep -L "==UserScript==" *.js` の出力が空であること
   - `grep -L "@updateURL" *.js` の出力が空であること（Tampermonkey 自動更新 URL 漏れ防止）
   - `grep -L "@version" *.js` の出力が空であること（更新検知漏れ防止）
3. **プレーン CSS の混入防止**: リポジトリ直下に単体の `.css` ファイルが存在しないこと（すべて `.js` に一本化）。

---

## 📚 ドキュメント管理義務

- **`README.md`**:
  - 人間・ユーザー向けの表紙およびカタログ。
  - スクリプトの新規追加・削除・対象サイト変更時は、**必ずカタログテーブルを同期更新**してください。
- **`AGENTS.md`**:
  - 本ガイド。設計原則、自動検査ルール、プロトコルの改定時に更新します。
- **`CLAUDE.md`**:
  - `@AGENTS.md` への参照を保持します。
