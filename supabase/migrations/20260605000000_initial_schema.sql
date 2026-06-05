-- ==============================================================================
-- 1. EXTENSÕES & TIPOS
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE public.product_status AS ENUM ('draft', 'published', 'inactive');

CREATE TYPE public.draft_status AS ENUM (
  'collecting_media',
  'processing_ai',
  'review_pending',
  'approved',
  'discarded'
);

-- ==============================================================================
-- 2. TABELAS
-- ==============================================================================

-- Tabela: store_settings (Configurações da ZapCart Store)
CREATE TABLE public.store_settings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_name text NOT NULL DEFAULT 'ZapCart Store',
    whatsapp_sales_number text,
    logo_url text,
    primary_color text DEFAULT '#000000',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: products
CREATE TABLE public.products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug text UNIQUE,
    title text NOT NULL,
    description text,
    price numeric(10,2),
    status public.product_status DEFAULT 'draft',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: product_images
CREATE TABLE public.product_images (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url text NOT NULL,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: draft_sessions (Motor do ZapCart MagicManager)
CREATE TABLE public.draft_sessions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number text,
    status public.draft_status DEFAULT 'collecting_media',
    raw_audio_url text,
    image_urls text[],
    
    ai_generated_title text,
    ai_generated_description text,
    ai_generated_price numeric(10,2),
    ai_missing_fields text[],
    
    linked_product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
    
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 3. TRIGGERS
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_store_settings_modtime BEFORE UPDATE ON public.store_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_products_modtime BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_draft_sessions_modtime BEFORE UPDATE ON public.draft_sessions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ==============================================================================
-- 4. RLS (Row Level Security)
-- ==============================================================================
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draft_sessions ENABLE ROW LEVEL SECURITY;

-- Políticas Públicas (Vitrine / ZapCart Store)
CREATE POLICY "Permitir leitura publica de configuracoes" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Permitir leitura publica de produtos publicados" ON public.products FOR SELECT USING (status = 'published');
CREATE POLICY "Permitir leitura publica de imagens de produtos publicados" ON public.product_images FOR SELECT USING (
    product_id IN (SELECT id FROM public.products WHERE status = 'published')
);

-- Políticas Administrativas (ZapCart MagicManager)
CREATE POLICY "Permitir gestao total de produtos para admins" ON public.products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir gestao total de imagens para admins" ON public.product_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir gestao total de rascunhos para admins" ON public.draft_sessions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir gestao total de config para admins" ON public.store_settings FOR ALL USING (auth.role() = 'authenticated');
