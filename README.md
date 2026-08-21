# cosmate-quiz

CosMate 心理測驗站 — 動漫宅圈互動測驗集合。

## 測驗

| 目錄 | 標題 | 正式網址 |
|------|------|---------|
| `otakumine/` | 動漫圈雷點分級表 | https://cosmate-otakumine.pages.dev/otakumine/ |

`shared/` 放跨測驗共用素材。

## 部署

**Cloudflare Pages 專案 `cosmate-otakumine`，Git 連接型。push 到 `main` 即自動 build 並上線。**

| 設定 | 值 |
|------|-----|
| Production branch | `main` |
| Build command | （無，純靜態） |
| Destination dir | （repo 根目錄，留空） |

`destination_dir` **留空 = 發布 repo 根目錄**，所以每個測驗都有自己的路徑：`/otakumine/`、未來的 `/xxx/`。
根目錄 `/` 由 `_redirects` 302 導到 `/otakumine/`，讓 IG／Threads 已經散出去的舊網址繼續可用。

### ⚠️ 不要把 destination_dir 設成單一測驗資料夾

2026-08-21 踩過：`destination_dir` 設 `otakumine` 時，那個資料夾**就是站台根目錄**，
於是 `/otakumine/` 不是真實路徑。Cloudflare Pages 對找不到的路徑會 fallback 回 `index.html`，
所以 `/otakumine/app.js` 回的是 **20128 bytes 的 `text/html`**（index.html 本人），不是 JS。

症狀極具欺騙性：**CSS 全部 inline，所以版面 100% 正常**，只有雷點池是空的——
瀏覽器 `Refused to execute script ... MIME type ('text/html') is not executable`，
`app.js` 從來沒跑過。看起來像「資料沒進來」，實際是路徑結構錯了。

驗收一定要**同時**看 HTTP code、size、**Content-Type** 三項：
`/otakumine/app.js` 回 `200` 但 type 是 `text/html`，只看 code 會以為是好的。

手動觸發部署（不必 push）：

```bash
curl -X POST -H "Authorization: Bearer $CF_TOKEN" \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects/cosmate-otakumine/deployments"
```

### 驗收部署時務必帶 cache-buster

`curl https://cosmate-otakumine.pages.dev/` 可能拿到邊緣快取的舊回應。改用
`curl "https://cosmate-otakumine.pages.dev/?cb=$RANDOM"` 並同時看 HTTP code、size、內容三者，
不要只信其中一項。

## 歷史

2026-04-05 建站、04-07 完成，但當時 Cloudflare 的 GitHub 整合只開了一個
autoconfig PR 就中斷，PR 沒被 merge、Cloudflare 端也沒建出專案，於是**做完的網站四個月沒有網址**。
2026-08-19 補上部署並改為 Git 連接型。

教訓：部署設定要有人看得見的紀錄（就是本節），否則「做完」和「上線」之間的斷點沒有人會發現。
