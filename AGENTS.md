# 🤖 AI Agent Guidelines & Development Manual for Userscripts

このドキュメントは、本リポジトリで作業を行うすべての AI エージェントおよび開発者が遵守すべきルール、設計原則、テスト手順、運用フローを定義したマスターガイドです。

---

## 🎯 プロジェクト概要 & AI エージェントの役割
- **プロジェクト名**: Userscripts (Safari iOS/macOS ユーザースクリプト & スタイル集)
- **対象プラットフォーム**:
  - Safari 拡張機能「Userscripts」(iOS / iPadOS / macOS - [quoid/userscripts](https://github.com/quoid/userscripts))
  - Tampermonkey（Chrome / Safari 両対応基準）
- **主言語 / ランタイム**: JavaScript (ES2020+), CSS (CSS3), Node.js v23+
- **AI エージェントの責務**:
  - Tampermonkey および Safari Userscripts 向けのユーザースクリプト（JS）とカスタムスタイル（CSS）を作成・保守する専門アシスタントです。
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

## 📐 スクリプト & スタイル実装規範・メタデータ生成仕様

### 1. 実装・コーディング規範
- **JavaScript (DOM操作)**:
  - SPA（Single Page Application）や要素の遅延ロードを考慮し、対象要素が初期描画時に存在しない場合でも確実に動作するよう、必要に応じて `MutationObserver` や適切な待機処理（リトライ・要素監視）を組み込んでください。
  - グローバルスコープ汚染を防ぐため、全体を即時実行関数式（IIFE）かつ `'use strict';` で記述してください。
- **CSS (スタイル上書き)**:
  - 既存 Web サイトのスタイル詳細度（Specificity）に負けないよう、必要に応じて `!important` を適切に使用してください。
- **出力ルール**:
  - コードを出力・提示する際は、必ず対応する言語のコードブロック（`javascript` または `css`）で囲んでください。

---

### 2. メタデータ生成仕様

#### ■ JavaScript の場合（Tampermonkey / Safari 両対応）
Safari版では `@name` がファイル名・UI表示名になるため、**わかりやすく一意な英数字ベースの名前**にしてください。

```javascript
// ==UserScript==
// @name         [スクリプト名（英数字推奨）]
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  [スクリプトの説明]
// @match        [対象サイトのURLパターン（http/httpsのみ）]
// @grant        none （※必要に応じてAPIを指定）
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    // ここに処理を記述
})();
```

#### ■ CSS の場合（Safari Userscripts専用 / .user.css）
Safari版 (`quoid/userscripts`) の仕様に基づき、**ブロックコメント形式**で出力します。
> [!WARNING]
> **重要禁止事項**: `@run-at` や `@inject-into` は JavaScript 専用のメタデータです。**CSS (UserStyle) には絶対に含めないでください**（パースエラーや不正動作の原因となります）。

```css
/* ==UserStyle==
@name          [スタイル名（英数字推奨）]
@version       1.0
@description   [スタイルの説明]
@match         [対象サイトのURLパターン（http/httpsのみ）]
==/UserStyle== */

/* ここにCSSを記述 */
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
