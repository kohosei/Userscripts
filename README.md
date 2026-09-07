# 🌐 Userscripts & Custom Styles Repository

iOS / iPadOS / macOS の Safari 拡張機能 **「Userscripts」** および **Tampermonkey** 向けのユーザースクリプト（JavaScript）とカスタムスタイル（CSS/JS）を統合管理するリポジトリです。

---

## 🌟 リポジトリの特徴

1. **📱 iOS 端末へのリアルタイム自動同期**:
   - 作業ツリーが iCloud Drive 上に配置されており、ファイルを保存・更新すると数秒以内に各 iOS 端末の Safari に反映されます。
2. **🛡️ 堅牢な分離 Git 管理 (`--separate-git-dir`)**:
   - iCloud Drive 同期による Git 内部オブジェクト破損を防止するため、Git ディレクトリ実体はローカル領域に分離配置されています。
3. **🔄 高いクロスプラットフォーム互換性**:
   - Safari 拡張機能「Userscripts」と Tampermonkey の双方で動作するよう、公式最新仕様（`@match` 準拠、遅延ロード対応、フォールバック付きスタイル注入）に基づいて設計されています。

---

## 📁 スクリプト & スタイル カタログ

### 📜 Userscripts (`.js`) - 機能拡張・自動化
| ファイル名 | 名称 (@name) | 対象サイト (@match) | 概要 |
| :--- | :--- | :--- | :--- |
| `x_swipe.js` | X (Twitter) Swipe Tab Switcher | `x.com`, `twitter.com` | タイムラインタブ（おすすめ / フォロー中 / リスト）を左右スワイプで切り替え |
| `x_reply_hide.js` | Hide_X_Replies | `x.com`, `twitter.com` | ツイート詳細ページでリプライ欄を非表示（ポスト主自身のリプライは残す） |
| `instagram_comments_hide.js` | InstagramLiveCommentHider | `instagram.com` | Instagram Live 視聴時のコメント欄および関連 UI を非表示 |
| `onsen_order.js` | 音泉 お気に入り番組 並び替えトグル | `onsen.ag` | お気に入り番組の表示順（デフォルト / 更新順 / 逆順）をワンタップ切替 |
| `ab_auto_login.js` | plusmember apollobay auto login | `secure.plusmember.jp` | Apollo Bay ログイン画面での自動ログイン実行 |
| `ab_open_login_page.js` | apollobaycruiser auto open login | `apollobaycruiser.jp` | 未ログイン状態を検知して自動でログインページへ遷移 |
| `ab_disable_carousel.js` | Disable Carousel Autoplay | `apollobaycruiser.jp` | トップページのカルーセル自動スクロールを停止 |
| `nagi_auto_login.js` | aoyamanagisa mypage auto login | `aoyamanagisa.jp` | マイページへのリダイレクトおよび自動ログイン |
| `nagi_mypage_redirect.js` | aoyamanagisa mypage redirect | `aoyamanagisa.jp` | ログインページ以外の特定画面からマイページへ自動転送 |

---

### 🎨 UserStyles (`.css`) - 要素非表示・デザイン調整
| ファイル名 | 名称 (@name) | 対象サイト (@match / @include) | 概要 |
| :--- | :--- | :--- | :--- |
| `yt_comments_hide.css` | Hide comments on YouTube | `youtube.com` | YouTube 動画ページのコメント欄およびライブチャット欄を非表示 |
| `qlover_comments_hide.css` | QloveR コメント非表示 | `qlover.jp` | 配信画面のチャット・コメント欄を非表示 |
| `qlover_store_hide.css` | QloveR SmartBanner非表示 | `qlover.jp` | アプリインストール誘導バナー（SmartBanner）を非表示 |
| `onsen_footer_hide.css` | Hide footer on onsen.ag | `onsen.ag` | 画面下部の不要なフッター領域を非表示 |
| `joqr_cpr_hide.css` | JOQR Hide Copyright | `joqr.co.jp/ag` | 著作権表示フッターを非表示 |
| `hibiki_news_hide.css` | Hide news-list on hibiki | `hibiki-radio.jp` | ニュース一覧セクションを非表示 |
| `ab_comments_hide.css` | HideBlogComments | `apollobaycruiser.jp` | 会員限定ブログのコメント欄を非表示 |
| `ab_notice_hide.css` | Hide sub-txt-list on apollo | `apollobaycruiser.jp` | サブテキスト一覧（お知らせ等）を非表示 |
| `nagi_footer_hide.css` | Hide footer on aoyamanagisa | `aoyamanagisa.jp` | サイト下部フッターを非表示 |
| `nagi_hide_title.css` | Hide title card on aoyamanagisa | `aoyamanagisa.jp` | タイムライン画面の巨大なタイトルカードを非表示 |
| `liella_banner_hide.css` | Hide bnrlink on yuigaoka | `lovelive-anime.jp/yuigaoka` | ページ上部・下部の各種バナーリンクを非表示 |
| `liellaclub_caption_footer_hide.css` | Hide elements on liellaclub | `lovelive-liellaclub.jp` | キャプションおよびフッターリンクを非表示 |
| `lovelive_link_hide.css` | Hide link on lovelive | `lovelive-anime.jp` | SNS リンク等の導線を非表示 |

> [!TIP]
> **今後のスタイル追加についての推奨**:
> Tampermonkey はプレーン `.css` ファイルの直接読み込みに対応していません。今後スタイルを追加・更新する際は、両環境で 100% 互換動作する **JavaScript 形式（`GM_addStyle` 注入）** での記述を推奨します（詳細は [AGENTS.md](./AGENTS.md) 参照）。

---

## 🚀 利用方法・端末同期手順

### 1. iOS / iPadOS での利用 (Safari Userscripts)
1. App Store から [Userscripts](https://apps.apple.com/app/userscripts/id1463298887) をインストール。
2. iOS の「設定」>「Safari」>「拡張機能」>「Userscripts」を有効化し、アクセス権を「すべての Web サイトで常に許可」に設定。
3. Userscripts アプリを開き、スクリプト保存先ディレクトリとして **iCloud Drive 内の `Userscripts` フォルダ** を選択。
4. これにより、Mac で本リポジトリを編集・コミットするたびに、iOS 端末へ自動的にスクリプトが同期・適用されます。
   *(※iOS 18 / macOS 15 以降では、ファイルがローカルから退避されないよう「ダウンロードしたままにする」設定を推奨)*

### 2. macOS Safari / Tampermonkey での利用
- **Safari Userscripts**: 上記と同様に保存先ディレクトリを本フォルダに指定。
- **Tampermonkey**: 各 `.js` ファイルをスクリプトダッシュボードにインポートまたはファイル URL から登録。

---

## 🛠️ 開発・運用ガイド (AI エージェント & 開発者)
本リポジトリの改修・機能追加を行う際は、必ず [`AGENTS.md`](./AGENTS.md) を確認してください。
- **Git 運用**: Modified Git-flow（安定版 `main` / 開発統合 `develop` / 作業用トピックブランチ）
- **品質ゲート**: コミット前に `node --check *.js` による構文検査が必須
- **iCloud 同期への配慮**: 作業途中であっても構文エラーを含むコードを放置しないこと
