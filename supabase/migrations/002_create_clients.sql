-- 顧客SaaSテナント管理テーブル
-- /admin/clients で表示する本番納品済み顧客の一覧を保持する。
create table clients (
  id uuid primary key default gen_random_uuid(),
  name varchar(100) not null,
  industry varchar(50) not null,
  domain varchar(200) not null unique,
  plan varchar(20) not null check (plan in ('starter', 'standard', 'premium')),
  status varchar(20) not null check (status in ('live', 'staging', 'paused')),
  contracted_at date not null,
  mau integer not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at 自動更新（001 で定義済みの関数を再利用）
create trigger clients_updated_at
  before update on clients
  for each row execute function update_updated_at();
