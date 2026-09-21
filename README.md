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
全スクリプトに Tampermonkey 自動更新用メタデータ（`@updateURL` / `@downloadURL`）が付与されています。Chrome で以下のリンク（Raw URL）を開くと、Tampermonkey のインストール画面が自動起動します。

| ファイル名 | 名称 (@name) | 対象サイト (@match) | インストール (Raw URL) | 概要 |
| :--- | :--- | :--- | :--- | :--- |
| `x_swipe.js` | X (Twitter) Swipe Tab Switcher | `x.com`, `twitter.com` | [Raw Link](https://raw.githubusercontent.com/kohosei/Userscripts/main/x_swipe.js) | タイムラインタブ（おすすめ / フォロー中 / リスト）を左右スワイプで切り替え |
| `x_reply_hide.js` | Hide_X_Replies | `x.com`, `twitter.com` | [Raw Link](https://raw.githubusercontent.com/kohosei/Userscripts/main/x_reply_hide.js) | ツイート詳細ページでリプライ欄を非表示（ポスト主自身のリプライは残す） |
| `instagram_comments_hide.js` | InstagramLiveCommentHider | `instagram.com` | [Raw Link](https://raw.githubusercontent.com/kohosei/Userscripts/main/instagram_comments_hide.js) | Instagram Live 視聴時のコメント欄および関連 UI を非表示 |
| `onsen_order.js` | 音泉 お気に入り番組 並び替えトグル | `onsen.ag` | [Raw Link](https://raw.githubusercontent.com/kohosei/Userscripts/main/onsen_order.js) | お気に入り番組の表示順（デフォルト / 更新順 / 逆順）をワンタップ切替 |
| `ab_auto_login.js` | plusmember apollobay auto login | `secure.plusmember.jp` | [Raw Link](https://raw.githubusercontent.com/kohosei/Userscripts/main/ab_auto_login.js) | Apollo Bay ログイン画面での自動ログイン実行 |
| `ab_open_login_page.js` | apollobaycruiser auto open login | `apollobaycruiser.jp` | [Raw Link](https://raw.githubusercontent.com/kohosei/Userscripts/main/ab_open_login_page.js) | 未ログイン状態を検知して自動でログインページへ遷移 |
| `ab_disable_carousel.js` | Disable Carousel Autoplay | `apollobaycruiser.jp` | [Raw Link](https://raw.githubusercontent.com/kohosei/Userscripts/main/ab_disable_carousel.js) | トップページのカルーセル自動スクロールを停止 |
| `nagi_auto_login.js` | aoyamanagisa mypage auto login | `aoyamanagisa.jp` | [Raw Link](https://raw.githubusercontent.com/kohosei/Userscripts/main/nagi_auto_login.js) | マイページへのリダイレクトおよび自動ログイン |
| `nagi_mypage_redirect.js` | aoyamanagisa mypage redirect | `aoyamanagisa.jp` | [Raw Link](https://raw.githubusercontent.com/kohosei/Userscripts/main/nagi_mypage_redirect.js) | ログインページ以外の特定画面からマイページへ自動転送 |

---

### 🎨 UserStyles (`.js`) - 要素非表示・デザイン調整（両環境完全互換）
すべてのスタイルは `GM_addStyle` 形式の JavaScript スクリプトとして実装されているため、**Stylus などの別拡張機能は不要**です。Safari Userscripts と Tampermonkey の双方で自動更新・適用されます。

| ファイル名 | 名称 (@name) | 対象サイト (@match) | インストール (Raw URL) | 概要 |
| :--- | :--- | :--- | :--- | :--- |
| `yt_comments_hide.js` | Hide comments and live chat on YouTube | `youtube.com` | [Raw Link](https://raw.githubusercontent.com/kohosei/Userscripts/main/yt_comments_hide.js) | YouTube 動画ページのコメント欄およびライブチャット欄を非表示 |
| `qlover_comments_hide.js` | QloveR コメント非表示 | `qlover.jp` | [Raw Link](https://raw.githubusercontent.com/kohosei/Userscripts/main/qlover_comments_hide.js) | 配信画面のチャット・コメント欄を非表示 |
| `qlover_store_hide.js` | QloveR SmartBanner非表示 | `qlover.jp` | [Raw Link](https://raw.githubusercontent.com/kohosei/Userscripts/main/qlover_store_hide.js) | アプリインストール誘導バナー（SmartBanner）を非表示 |
| `onsen_footer_hide.js` | Hide footer-bottom-wrapper on www.onsen.ag | `onsen.ag` | [Raw Link](https://raw.githubusercontent.com/kohosei/Userscripts/main/onsen_footer_hide.js) | 画面下部の不要なフッター領域を非表示 |
| `joqr_cpr_hide.js` | JOQR Hide Copyright | `joqr.co.jp/ag` | [Raw Link](https://raw.githubusercontent.com/kohosei/Userscripts/main/joqr_cpr_hide.js) | 著作権表示フッターを非表示 |
| `hibiki_news_hide.js` | Hide news-list on hibiki-radio.jp | `hibiki-radio.jp` | [Raw Link](https://raw.githubusercontent.com/kohosei/Userscripts/main/hibiki_news_hide.js) | ニュース一覧セクションを非表示 |
| `ab_comments_hide.js` | HideBlogComments | `apollobaycruiser.jp` | [Raw Link](https://raw.githubusercontent.com/kohosei/Userscripts/main/ab_comments_hide.js) | 会員限定ブログのコメント欄を非表示 |
| `ab_notice_hide.js` | Hide sub-txt-list on apollobaycruiser.jp | `apollobaycruiser.jp` | [Raw Link](https://raw.githubusercontent.com/kohosei/Userscripts/main/ab_notice_hide.js) | サブテキスト一覧（お知らせ等）を非表示 |
| `nagi_footer_hide.js` | Hide footer-bottom on aoyamanagisa.jp | `aoyamanagisa.jp` | [Raw Link](https://raw.githubusercontent.com/kohosei/Userscripts/main/nagi_footer_hide.js) | サイト下部フッターを非表示 |
| `nagi_hide_title.js` | Hide timeline title card on aoyamanagisa.jp | `aoyamanagisa.jp` | [Raw Link](https://raw.githubusercontent.com/kohosei/Userscripts/main/nagi_hide_title.js) | タイムライン画面の巨大なタイトルカードを非表示 |
| `liella_banner_hide.js` | Hide bnrlink on yuigaoka top only | `lovelive-anime.jp/yuigaoka` | [Raw Link](https://raw.githubusercontent.com/kohosei/Userscripts/main/liella_banner_hide.js) | ページ上部・下部の各種バナーリンクを非表示 |
| `liellaclub_caption_footer_hide.js` | Hide selected elements on lovelive-liellaclub.jp | `lovelive-liellaclub.jp` | [Raw Link](https://raw.githubusercontent.com/kohosei/Userscripts/main/liellaclub_caption_footer_hide.js) | キャプションおよびフッターリンクを非表示 |
| `lovelive_link_hide.js` | Hide link on lovelive | `lovelive-anime.jp` | [Raw Link](https://raw.githubusercontent.com/kohosei/Userscripts/main/lovelive_link_hide.js) | SNS リンク等の導線を非表示 |

---

## 🚀 利用方法・端末同期手順

### 1. iOS / iPadOS での利用 (Safari Userscripts)
1. App Store から [Userscripts](https://apps.apple.com/app/userscripts/id1463298887) をインストール。
2. iOS の「設定」>「Safari」>「拡張機能」>「Userscripts」を有効化し、アクセス権を「すべての Web サイトで常に許可」に設定。
3. Userscripts アプリを開き、スクリプト保存先ディレクトリとして **iCloud Drive 内の `Userscripts` フォルダ** を選択。
4. これにより、Mac で本リポジトリを編集・コミットするたびに、iOS 端末へ自動的にスクリプトが同期・適用されます。
   *(※iOS 18 / macOS 15 以降では、ファイルがローカルから退避されないよう「ダウンロードしたままにする」設定を推奨)*

### 2. Chrome / Tampermonkey での利用（自動更新対応）
1. Chrome ウェブストアから **[Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)** をインストール。
2. 上記カタログの「インストール (Raw Link)」をクリックするか、URL を Chrome で直接開きます。
3. Tampermonkey のインストール画面が表示されるので **「インストール」** をクリックします。
4. **🔄 自動更新の仕組み**:
   - スクリプトには `@updateURL` / `@downloadURL` が設定されており、本リポジトリの `main` ブランチに更新（および `@version` の引き上げ）がマージされると、Tampermonkey が自動で最新版を取得・更新します。
   - 他の PC の Chrome でも同様にインストールしておくことで、常に全端末で最新のスクリプトが維持されます。
   - 即座に更新を確認したい場合は、Tampermonkey ダッシュボードの「スクリプトの更新を確認」を実行してください。

### 3. macOS Safari (Safari Userscripts) での利用
- 上記「1. iOS / iPadOS での利用」と同様に、保存先ディレクトリを iCloud Drive の本フォルダに指定するだけで、追加の手順なしに自動反映されます。

---

## 🛠️ 開発・運用ガイド (AI エージェント & 開発者)
本リポジトリの改修・機能追加を行う際は、必ず [`AGENTS.md`](./AGENTS.md) を確認してください。
- **Git 運用**: Modified Git-flow（安定版 `main` / 開発統合 `develop` / 作業用トピックブランチ）
- **品質ゲート**: コミット前に `node --check *.js` による構文検査が必須
- **iCloud 同期への配慮**: 作業途中であっても構文エラーを含むコードを放置しないこと
