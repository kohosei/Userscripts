# Userscripts & UserStyles for Safari

iOS / iPadOS / macOS の Safari 拡張機能「Userscripts」で利用するユーザースクリプト (`.js`) およびユーザースタイル (`.css`) の管理リポジトリです。

---

## 📁 スクリプト & スタイル一覧

### 📜 Userscripts (`.js`)
| ファイル名 | 名称 (@name) | 対象サイト (@match) | 概要 |
| :--- | :--- | :--- | :--- |
| `x_swipe.js` | X (Twitter) Swipe Tab Switcher | `x.com`, `twitter.com` | 左右スワイプでタイムラインタブ（For you / Following / リスト）を切り替え |
| `x_reply_hide.js` | Hide_X_Replies | `x.com`, `twitter.com` | ツイート詳細ページでリプライ欄を非表示（本人の返信は表示） |
| `instagram_comments_hide.js` | InstagramLiveCommentHider | `instagram.com` | Instagram Live のコメント欄や関連 UI を非表示 |
| `onsen_order.js` | 音泉 お気に入り番組 並び替えトグル | `onsen.ag` | お気に入り番組の表示順（デフォルト / 更新順 / 逆順）を切替 |
| `ab_auto_login.js` | plusmember apollobay auto login | `secure.plusmember.jp` | Apollo Bay ログイン画面での自動ログイン |
| `ab_open_login_page.js` | apollobaycruiser auto open login | `apollobaycruiser.jp` | 未ログイン時に自動でログイン画面へ遷移 |
| `ab_disable_carousel.js` | Disable Carousel Autoplay | `apollobaycruiser.jp` | トップページのカルーセル自動スクロールを無効化 |
| `nagi_auto_login.js` | aoyamanagisa mypage auto login | `aoyamanagisa.jp` | マイページへのリダイレクトおよび自動ログイン |
| `nagi_mypage_redirect.js` | aoyamanagisa mypage redirect | `aoyamanagisa.jp` | ログインページ以外の特定ページからマイページへ自動リダイレクト |

### 🎨 UserStyles (`.css`)
| ファイル名 | 名称 (@name) | 対象サイト (@match / @include) | 概要 |
| :--- | :--- | :--- | :--- |
| `yt_comments_hide.css` | Hide comments on YouTube | `youtube.com` | コメント欄およびライブチャット欄を非表示 |
| `qlover_comments_hide.css` | QloveR コメント非表示 | `qlover.jp` | 配信ページのチャット・コメント欄を非表示 |
| `qlover_store_hide.css` | QloveR SmartBanner非表示 | `qlover.jp` | アプリ誘導 SmartBanner を非表示 |
| `onsen_footer_hide.css` | Hide footer on onsen.ag | `onsen.ag` | フッター下部要素を非表示 |
| `joqr_cpr_hide.css` | JOQR Hide Copyright | `joqr.co.jp/ag` | 著作権表示フッターを非表示 |
| `hibiki_news_hide.css` | Hide news-list on hibiki | `hibiki-radio.jp` | ニュース一覧を非表示 |
| `ab_comments_hide.css` | HideBlogComments | `apollobaycruiser.jp` | ブログコメント欄を非表示 |
| `ab_notice_hide.css` | Hide sub-txt-list on apollo | `apollobaycruiser.jp` | サブテキストリストを非表示 |
| `nagi_footer_hide.css` | Hide footer on aoyamanagisa | `aoyamanagisa.jp` | フッター下部を非表示 |
| `nagi_hide_title.css` | Hide title card on aoyamanagisa | `aoyamanagisa.jp` | タイムラインのタイトルカードを非表示 |
| `liella_banner_hide.css` | Hide bnrlink on yuigaoka | `lovelive-anime.jp/yuigaoka` | バナーリンクを非表示 |
| `liellaclub_caption_footer_hide.css` | Hide elements on liellaclub | `lovelive-liellaclub.jp` | キャプションおよびフッターリンクを非表示 |
| `lovelive_link_hide.css` | Hide link on lovelive | `lovelive-anime.jp` | SNS リンク等を非表示 |

---

## 🛠️ 開発・運用ガイド
AI エージェントおよび開発者は、必ず [`AGENTS.md`](./AGENTS.md) を確認してください。
本リポジトリは iCloud Drive との同期破損を防ぐため `--separate-git-dir` で分離管理されています。
