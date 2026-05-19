@AGENTS.md

# demo-builder — CLAUDE.md

グローバルルール（`/Users/yukiota/Desktop/Clans Quest Project/CLAUDE.md`）を前提とし、
以下をこのプロジェクト固有のルールとして補足する。

---

## 1. このプロジェクトの役割

クライアント商談時に「御社ならこう管理できます」と見せるための業種別業務管理デモサイトビルダー。
レイドキュー社の社内営業ツール。外部には非公開（デモ用途）。

---

## 2. 基本情報

| 項目 | 値 |
|------|-----|
| 本番URL | https://demo-builder-coral.vercel.app |
| GitHub | https://github.com/gopan29/demo-builder |
| Supabase Ref | `bdxjhtiwhzfgdvyiclnx` |
| Vercel Project ID | `prj_C1HZn5yulwTMGLf9o4ncHZiCB8aO` |
| ローカルパス | `/Users/yukiota/Desktop/Clans Quest Project/demo-builder` |
| デプロイ | `main` への push → Vercel 自動デプロイ |

---

## 3. 技術スタック

- Next.js 16 (App Router + TypeScript)
- Supabase (Auth + DB)
- Tailwind CSS v4
- Vercel

---

## 4. 現在の完成度・残タスク

実装済みテンプレート：
- ドッグサロン
- 美容室

`app/admin/` が管理画面、`app/demo/` がデモ表示側。

---

## 5. 注意事項

- デモ用途のため、本番データや個人情報は扱わないこと
- テンプレートを新規追加する場合は、既存テンプレートの構成に合わせること
- Supabase クライアントは標準パターンに従うこと（`operations/supabase-standard.md` 参照）

---

## Notion Research DB 連携

このプロジェクトで得たナレッジは CQP OS のリサーチ保存から Research DB に記録する。

- **カテゴリ**: `Web制作`
- **Research DB**: https://www.notion.so/35ed45cf8a118190a52dec935449fdbb
- **記録すべきもの**: ChatGPTで調べた業務知識・施策・ノウハウ・失敗から学んだこと
