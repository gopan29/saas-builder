@AGENTS.md

# saas-builder — CLAUDE.md

グローバルルール（`/Users/yukiota/Desktop/Clans Quest Project/CLAUDE.md`）を前提とし、
以下をこのプロジェクト固有のルールとして補足する。

---

## 1. このプロジェクトの役割

レイドキュー社の社内ツール。営業デモ・顧客SaaS・業種サンプルテンプレートを統合管理するハブ。
2026-05-20 に旧 demo-builder からリネームし、役割を「デモビルダー単機能」から「SaaS Builder（4セクション統合管理）」に拡張した。

外部には非公開（社内営業・運用ツール）。

---

## 2. 基本情報

| 項目 | 値 |
|------|-----|
| 本番URL | https://saas-builder-coral.vercel.app （※ Production Domain 昇格は未完。詳細は §4 残タスク） |
| 旧URL | https://demo-builder-coral.vercel.app （まだ Production Domain として残存） |
| GitHub | https://github.com/gopan29/saas-builder |
| Supabase Ref | `bdxjhtiwhzfgdvyiclnx` |
| Vercel Project ID | `prj_C1HZn5yulwTMGLf9o4ncHZiCB8aO` |
| ローカルパス | `/Users/yukiota/Desktop/Clans Quest Project/demo-builder` （※ リネーム未実施。saas-builder/ にmv予定） |
| デプロイ | **手動**: `git push origin main` 後に `vercel --prod` を必ず実行（自動デプロイが効かないため） |

---

## 3. 技術スタック

- Next.js 16 (App Router + TypeScript)
- Supabase (Auth + DB)
- Tailwind CSS v4
- Vercel

---

## 4. 現在の完成度・残タスク

### 完了（2026-05-20）

- ツール名・GitHub・Vercel プロジェクトを saas-builder にリネーム
- 管理画面トップを新ダッシュボード化（`/admin`）
- 4セクション構成：
  - `/admin/demos` — デモ案件管理（既存ロジック移設）
  - `/admin/clients` — 顧客SaaS一覧（**Supabase clients テーブルで実データ化**）
  - `/admin/samples` — 業種テンプレ8種の入口
  - `/admin/settings` — 設定（読み取り専用）
- `clients` テーブル作成（`supabase/migrations/002_create_clients.sql`）。シード3件（Beam / MOMO / 青木整骨院）投入済み

### 残タスク

1. **Vercel Production Domain 切替** — `saas-builder-coral.vercel.app` を Production に昇格、旧 `demo-builder-coral.vercel.app` を Remove。Vercel Dashboard → saas-builder/settings/domains で実施
2. **ローカルディレクトリ rename** — `Clans Quest Project/demo-builder/` → `saas-builder/`。Claude Code セッション終了後にユーザーが手動 mv
3. **Vercel 自動デプロイの修復** — 現状 main push で自動デプロイが発火しない。Vercel Dashboard → Settings → Git の Production Branch / Ignored Build Step を要確認
4. **顧客SaaS の新規追加UI** — 現状は SQL 直入力。`/admin/clients/new` の作成は未着手

---

## 5. 注意事項

- デモ用途のため、本番データや個人情報は扱わないこと
- 業種テンプレートを新規追加する場合は、既存テンプレート（`lib/industry-templates.ts`）の構成に合わせること
- Supabase クライアントは標準パターンに従うこと（`operations/supabase-standard.md` 参照）
- **`.claude/settings.local.json` の `mcp__supabase-demo-builder__*` は接続安定性のため意図的に旧名で保持**。リネームしない
- 「本番デプロイ」「手動本番デプロイ」と言われたら `vercel --prod` を実行する（自動デプロイは現状効かない）

---

## Notion Research DB 連携

このプロジェクトで得たナレッジは CQP OS のリサーチ保存から Research DB に記録する。

- **カテゴリ**: `Web制作`
- **Research DB**: https://www.notion.so/35ed45cf8a118190a52dec935449fdbb
- **記録すべきもの**: ChatGPTで調べた業務知識・施策・ノウハウ・失敗から学んだこと
