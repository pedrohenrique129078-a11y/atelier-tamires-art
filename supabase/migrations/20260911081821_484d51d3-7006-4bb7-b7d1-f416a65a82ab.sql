CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE public.booking_status AS ENUM ('PENDENTE','AGUARDANDO_PAGAMENTO','COMPROVANTE_ENVIADO','CONFIRMADO','CANCELADO','CONCLUIDO');
CREATE TYPE public.payment_status AS ENUM ('AGUARDANDO_CONFIRMACAO','COMPROVANTE_ENVIADO','CONFIRMADO');
CREATE TYPE public.booking_kind AS ENUM ('SERVICO','CURSO');
CREATE TYPE public.attendance_mode AS ENUM ('ESTABELECIMENTO','DOMICILIAR');

CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (char_length(slug) BETWEEN 2 AND 80),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
  description text,
  image_url text,
  featured boolean NOT NULL DEFAULT false,
  position integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active categories" ON public.categories FOR SELECT TO anon, authenticated USING (active = true);

CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.categories(id),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  description text,
  duration_minutes integer CHECK (duration_minutes IS NULL OR duration_minutes > 0),
  price_cents integer CHECK (price_cents IS NULL OR price_cents >= 0),
  attendance_modes public.attendance_mode[] NOT NULL DEFAULT ARRAY['ESTABELECIMENTO']::public.attendance_mode[],
  availability_notes text,
  image_url text,
  active boolean NOT NULL DEFAULT false,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon, authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active services" ON public.services FOR SELECT TO anon, authenticated USING (active = true);

CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 180),
  description text NOT NULL CHECK (char_length(description) <= 3000),
  duration_text text,
  price_cents integer CHECK (price_cents IS NULL OR price_cents >= 0),
  attendance_mode text NOT NULL DEFAULT 'PRESENCIAL',
  availability_notes text,
  image_url text,
  active boolean NOT NULL DEFAULT true,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.courses TO anon, authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active courses" ON public.courses FOR SELECT TO anon, authenticated USING (active = true);

CREATE TABLE public.availability_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  starts_at timestamptz NOT NULL UNIQUE,
  duration_minutes integer NOT NULL CHECK (duration_minutes > 0),
  attendance_mode public.attendance_mode,
  available boolean NOT NULL DEFAULT true,
  held_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.availability_slots TO service_role;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id uuid NOT NULL REFERENCES public.availability_slots(id),
  kind public.booking_kind NOT NULL,
  service_id uuid REFERENCES public.services(id),
  course_id uuid REFERENCES public.courses(id),
  item_name text NOT NULL,
  starts_at timestamptz NOT NULL,
  attendance_mode public.attendance_mode NOT NULL,
  client_name text NOT NULL CHECK (char_length(client_name) BETWEEN 2 AND 120),
  client_phone text NOT NULL CHECK (char_length(client_phone) BETWEEN 8 AND 30),
  client_email text CHECK (client_email IS NULL OR char_length(client_email) <= 255),
  postal_code text,
  street text,
  street_number text,
  complement text,
  neighborhood text,
  city text,
  state text,
  location_text text NOT NULL,
  price_cents integer CHECK (price_cents IS NULL OR price_cents >= 0),
  status public.booking_status NOT NULL DEFAULT 'AGUARDANDO_PAGAMENTO',
  payment_status public.payment_status NOT NULL DEFAULT 'AGUARDANDO_CONFIRMACAO',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT booking_item_matches_kind CHECK ((kind = 'SERVICO' AND service_id IS NOT NULL AND course_id IS NULL) OR (kind = 'CURSO' AND course_id IS NOT NULL AND service_id IS NULL)),
  CONSTRAINT home_address_required CHECK (attendance_mode <> 'DOMICILIAR' OR (postal_code IS NOT NULL AND street IS NOT NULL AND street_number IS NOT NULL AND neighborhood IS NOT NULL AND city IS NOT NULL AND state IS NOT NULL))
);
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE UNIQUE INDEX bookings_active_slot_unique ON public.bookings(slot_id) WHERE status NOT IN ('CANCELADO');

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER availability_slots_updated_at BEFORE UPDATE ON public.availability_slots FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.categories (slug, name, description, featured, position) VALUES
('depilacoes','Depilações','Apresentação elegante dos cuidados de depilação.',false,1),
('manicure-pedicure','Manicure e Pedicure','Categoria principal para os cuidados de unhas.',true,2),
('sobrancelha','Sobrancelha','Cuidados refinados para sobrancelhas.',false,3),
('tratamento-podocure','Tratamento Podocure','Cuidado especializado, higiene, precisão, conforto e bem-estar.',false,4),
('spa-alto-padrao','SPA Alto Padrão','Relaxamento, autocuidado, exclusividade e experiência premium.',false,5);

INSERT INTO public.courses (slug, name, description, duration_text, position) VALUES
('vip-individual-iniciante-manicure','VIP individual iniciante manicure','16 horas suporte via whatsapp 2 dias seguidos, certificado kit iniciante, material didático, mas caderno de treino, coffee break incluso nos 2 dias e almoço também nos 2 dias, sala curso libra','16 horas · 2 dias seguidos',1),
('combo-spa-alto-padrao-vip','Combo SPA de alto padrão VIP (individual)','8 horas 1 dia | SPA terapêutico + SPA gelatina (escalda pés e mais bônus (ultra hidratação, nanotterapia fisiologia de pele)','8 horas · 1 dia',2),
('classica-grupo-iniciante-manicure','Clássica (grupo) de iniciante manicure até 5 pessoas','16 horas 2 dias | suporte via whatsapp, certificado, material didático mais caderno de treino, coffee break incluso nos 2 dias, kit iniciante 1 item de cada material inicial exclusivo','16 horas · 2 dias',3),
('spa-pes-lore-tratamento-podal-vip','SPA dos pés lore pé + tratamento podal+bônus VIP','8 horas 1 dia | você ganha 1 kit com 5 produtos + 1 ultra hidratação, certificado, apostila exclusiva personalizada, coffee break exclusivo','8 horas · 1 dia',4),
('combo-amigas-manicure-iniciante','Combo com as amigas, para manicure iniciante','8 horas 1 dia,16 horas curso completo, coffee break incluso nos 2 dias e almoço também, material didático e kit exclusivo para iniciar 1 pra cada, certificado','8 ou 16 horas',5),
('aulas-praticas-individual','Aulas práticas individual','Para quem tem dificuldade e quer praticar individual, certificado do dia 8 horas de teoria e prática','8 horas',6),
('aulas-praticas-grupo-manicure','Aulas práticas em grupo manicure','Para quem tem dificuldade com prática no mínimo 2 pessoas, workshop demonstrativo e prático e o valor é individual',NULL,7),
('manicure-express','Manicure express','Conhecimento de produtos e práticas 1 dia 8 horas, certificado e material didático, coffee break incluso','8 horas · 1 dia',8),
('combo-spa-pes-amigas','Combo SPA DOS PÉS das amigas','8 horas aula, kit completo com 5 itens de SPA, coffee break incluso, certificado, apostila','8 horas',9),
('especializacao-manicure-premium-vip','Especialização manicure PREMIUM VIP (individual)','Aprenda técnica atualizada de manicure tradicional + peeling lingual + desencravar MANICURE, vela terapia, nanotecnologia, mapa de reflexologia podal, 3 dias a combinar, material didático exclusivo, 2 certificados e termo de responsabilidade, coffee break incluso nos 2','3 dias a combinar',10),
('manicure-premium-especialista-360-vip','Manicure PREMIUM Especialista 360° VIP (individual)','Aprenda técnica de desencravar, mais peeling ungueal, esmaltação perfeita, CUTICULAGEM bordada e contínua, termo de responsabilidade, 2 certificados, precificação, lista de fornecedores e material, 2 dias de curso','2 dias',11);