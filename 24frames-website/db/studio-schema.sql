-- 24 Frames studio schema. Generated from src/lib/studio/server/schema.sql.ts
-- The app applies this automatically on first connection; it is here for manual setup and migrations.
create schema if not exists studio;

create table if not exists studio.config (
  id          smallint primary key default 1 check (id = 1),
  version     integer not null,
  config      jsonb not null,
  updated_at  timestamptz not null default now()
);

create table if not exists studio.couples (
  id                 uuid primary key,
  bride_name         text not null default '',
  groom_name         text not null default '',
  phone              text not null default '',
  email              text not null default '',
  wedding_date       text not null default '',
  approximate_date   text not null default '',
  city               text not null default '',
  preferred_contact  text not null default 'whatsapp',
  notes              text not null default '',
  created_at         timestamptz not null default now()
);

create table if not exists studio.commissions (
  id                        uuid primary key,
  reference                 text not null unique,
  couple_id                 uuid not null references studio.couples(id) on delete restrict,
  status                    text not null default 'submitted',
  consultant                text not null,
  delivery_tier_id          text,
  applied_charge_ids        jsonb not null default '[]',
  post_production_override  jsonb,
  grand_total               integer not null,
  config_version            integer not null,
  draft_id                  text not null,
  duplicated_from           text,
  draft_created_at          timestamptz not null,
  created_at                timestamptz not null default now()
);
create index if not exists commissions_created_at_idx on studio.commissions (created_at desc);

create table if not exists studio.events (
  commission_id         uuid not null references studio.commissions(id) on delete cascade,
  id                    text not null,
  sort_order            integer not null,
  name                  text not null default '',
  type                  text not null,
  custom_type           text not null default '',
  date                  text not null default '',
  start_time            text not null default '',
  end_time              text not null default '',
  venue                 text not null default '',
  location              text not null default '',
  guest_count           integer,
  venue_setting         text not null default '',
  venue_scale           text not null default '',
  parallel_activities   boolean not null default false,
  special_requirements  text not null default '',
  notes                 text not null default '',
  primary key (commission_id, id)
);

create table if not exists studio.assignments (
  commission_id        uuid not null,
  id                   text not null,
  event_id             text not null,
  service_id           text not null,
  quantity             integer not null check (quantity > 0),
  unit_price_override  integer,
  override_reason      text not null default '',
  unit_price           integer not null,
  line_total           integer not null,
  primary key (commission_id, id),
  foreign key (commission_id, event_id) references studio.events(commission_id, id) on delete cascade
);

create table if not exists studio.quotes (
  commission_id    uuid primary key references studio.commissions(id) on delete cascade,
  quote            jsonb not null,
  config_snapshot  jsonb not null
);

create table if not exists studio.activity (
  id             uuid primary key,
  commission_id  uuid not null references studio.commissions(id) on delete cascade,
  channel        text not null,
  status         text not null,
  detail         text not null default '',
  by_name        text not null,
  at             timestamptz not null default now()
);
create index if not exists activity_commission_idx on studio.activity (commission_id, at);

create table if not exists studio.media (
  name          text primary key,
  content_type  text not null,
  bytes         bytea not null,
  created_at    timestamptz not null default now()
);

alter table studio.config      enable row level security;
alter table studio.couples     enable row level security;
alter table studio.commissions enable row level security;
alter table studio.events      enable row level security;
alter table studio.assignments enable row level security;
alter table studio.quotes      enable row level security;
alter table studio.activity    enable row level security;
alter table studio.media       enable row level security;
