# 🤖 AI Agent Guidelines & Development Manual for Userscripts

このドキュメントは、本リポジトリで作業を行うすべての AI エージェントおよび開発者が遵守すべきルール、設計原則、テスト手順、運用フローを定義したマスターガイドです。

---

## 🎯 プロジェクト概要 & 技術スタック
- **プロジェクト名**: Userscripts (Safari iOS/macOS ユーザースクリプト & スタイル集)
- **主言語 / ランタイム**: JavaScript (ES2020+), CSS (CSS3), Node.js v23+
- **プラットフォーム**: Safari 拡張機能「Userscripts」(iOS / iPadOS / macOS)
- **主要な責務**:
  - iOS/macOS の Safari 上で各種 Web サイト（X, Instagram, YouTube, 音泉, ファンクラブサイト等）の不要要素非表示、UI 改善、自動ログイン、操作支援を提供する。

---

## ⚠️ リポジトリ構造と特殊運用ルール (CRITICAL)

本リポジトリは、**「iOS 端末への iCloud リアルタイム同期」** と **「破損リスクのない堅牢な Git バージョン管理」** を両立するため、Git 標準の `--separate-git-dir` 方式を採用しています。

```
[iCloud Drive (iOS同期領域 / ワークツリー)]
/Users/user/Library/Mobile Documents/com~apple~CloudDocs/Userscripts/
  ├── .git (テキストファイル: gitdir: /Users/user/_Costom_Local_User_Folder/_Antigravity/userscripts.git を指す)
  ├── .gitignore
  ├── AGENTS.md
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

## 📐 スクリプト & スタイル記述規約

すべてのファイルは、Safari 拡張「Userscripts」が正しくメタデータを読み取れるよう、以下の形式を厳守してください。

### 1. Userscript (`.js`)
- 必ず先頭に `==UserScript==` メタデータブロックを記述する。
- グローバルスコープ汚染を防ぐため、全体を即時関数（IIFE）かつ `'use strict';` で記述する。

```javascript
// ==UserScript==
// @name         スクリプトの名称
// @match        https://example.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // 処理本体
})();
```

### 2. UserStyle (`.css`)
- 必ず先頭に `==UserStyle==` メタデータブロックを記述する。

```css
/* ==UserStyle==
@name           スタイルの名称
@version        1.0
@description    スタイルの説明
@match          https://example.com/*
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
  - `fix/`: セレクタ変更対応、不具合修正
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
   - ヘッダーメタデータ（`@name`, `@match` 等）を正確に記載する。
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

---

## 📚 ドキュメント & スクリプト管理

### 管理場所
- `AGENTS.md`: 本ガイド（開発・運用マニュアル）
- `README.md`: スクリプト一覧・対象サイト・役割のカタログ

### スクリプト追加・変更時の義務
新しいスクリプトやスタイルを追加、またはセレクタ変更等の大幅な仕様変更を行った場合は、`README.md` のカタログにも反映してください。
