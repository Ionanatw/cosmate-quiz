# cosmate-quiz

CosMate 心理測驗站 — 動漫宅圈互動測驗集合。

## 測驗

| 目錄 | 標題 | 正式網址 |
|------|------|---------|
| `otakumine/` | 動漫圈雷點分級表 | https://cosmate-otakumine.pages.dev/ |

`shared/` 放跨測驗共用素材。

## 部署

**Cloudflare Pages 專案 `cosmate-otakumine`，Git 連接型。push 到 `main` 即自動 build 並上線。**

| 設定 | 值 |
|------|-----|
| Production branch | `main` |
| Build command | （無，純靜態） |
| Destination dir | `otakumine` |

`destination_dir` 是 `otakumine`，所以**只有那個資料夾會被發布**，repo 其他內容不會對外。新增測驗要另開 Pages 專案，或改 destination 並調整路徑。

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
