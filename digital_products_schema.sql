-- ============================================================================
-- INFINITY DIGITAL PRODUCTS (Estilo Kiwify / Infoprodutos & E-books)
-- Esquema para produtos digitais avulsos, e-books, checkouts e vendas.
-- Pode rodar no SQL Editor do Supabase.
-- ============================================================================

create table if not exists public.digital_products (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  description         text,
  sales_page_url      text,
  price               numeric(10,2) not null default 0.00,
  currency            text not null default 'BRL',
  payment_type        text not null default 'single',       -- single | subscription
  delivery_type       text not null default 'members_area', -- members_area | external | files | payments_only
  members_area_name   text,
  file_url            text,                                 -- URL do PDF / E-book
  cover_url           text,
  status              text not null default 'active',       -- active | paused | draft
  total_sales         int not null default 0,
  total_revenue       numeric(10,2) not null default 0.00,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table if not exists public.digital_orders (
  id                  uuid primary key default gen_random_uuid(),
  product_id          uuid references public.digital_products(id) on delete set null,
  customer_name       text not null,
  customer_email      text not null,
  customer_phone      text,
  amount              numeric(10,2) not null,
  currency            text not null default 'BRL',
  payment_method      text not null default 'pix',          -- pix | credit_card | boleto
  status              text not null default 'paid',         -- paid | pending | refunded
  download_token      text,
  created_at          timestamptz not null default now()
);

-- Seed de demonstração inicial
insert into public.digital_products
  (name, description, sales_page_url, price, currency, payment_type, delivery_type, members_area_name, status, total_sales, total_revenue)
values
  ('NeuroDesign', 'E-book e templates de neurodesign aplicados a criativos de alta conversão para tráfego pago e mídias sociais.', 'https://instagram.com/infinityondemand', 24.90, 'BRL', 'single', 'members_area', 'NeuroDesign', 'active', 14, 348.60)
on conflict do nothing;
