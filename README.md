# Demo Builder

クライアント商談時に「御社ならこう管理できます」と見せるための業種別業務管理デモサイトビルダー。社内営業ツール。

## 基本情報

| 項目 | 値 |
|------|----|
| 本番URL | https://demo-builder-coral.vercel.app |
| GitHub | https://github.com/gopan29/demo-builder |
| Supabase Ref | `bdxjhtiwhzfgdvyiclnx` |
| Vercel Project ID | `prj_C1HZn5yulwTMGLf9o4ncHZiCB8aO` |
| ローカルパス | `/Users/yukiota/Desktop/Clans Quest Project/demo-builder` |
| デプロイ | `main` への push → Vercel 自動デプロイ |

## 技術スタック

- Next.js 16 (App Router + TypeScript)
- Supabase (Auth + DB)
- Tailwind CSS v4
- Vercel

## ローカル起動

```bash
cd demo-builder
npm install
# .env.local に NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY を設定
npm run dev
```

## 環境変数

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## ページ構成

| パス | 認証 | 概要 |
|------|------|------|
| `/` | 不要 | 公開ランディングページ |
| `/admin` | 必要 | デモ案件一覧 |
| `/admin/new` | 必要 | 新規デモ作成 |
| `/demo/[slug]` | 不要 | デモ閲覧（公開） |

## 対応業種（8業種）

| 識別子 | 業種 |
|--------|------|
| `dog_salon` | ドッグサロン |
| `beauty_salon` | 美容室 |
| `dental_clinic` | 歯科クリニック |
| `restaurant` | 飲食店 |
| `esthetic_salon` | エステサロン |
| `osteopathic_clinic` | 整骨院・接骨院 |
| `juku` | 学習塾 |
| `yoga_fitness` | ヨガ・フィットネス |

業種テンプレートは `lib/industry-templates.ts` で一元管理。  
サンプルデータは `lib/sample-data-*.ts` に埋め込み（従量課金APIは未使用）。

## DB構成

- `demos` テーブル（RLS無効）: `slug` / `client_name` / `industry_template` / `theme_color` / `is_active`

## 残タスク

- [ ] デモURLのQRコード表示
- [ ] 管理画面からサンプルデータをカスタマイズできる機能
- [ ] デモ閲覧に簡易パスワード保護
