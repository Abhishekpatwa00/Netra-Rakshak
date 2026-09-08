CREATE TYPE public.app_role AS ENUM ('admin', 'doctor', 'kiosk');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can self-register as kiosk or doctor"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND role IN ('kiosk', 'doctor'));

CREATE TABLE public.screenings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid NOT NULL,
  patient_name text NOT NULL,
  contact_number text NOT NULL,
  abha_id text NOT NULL,
  image_path text NOT NULL,
  ai_grade text NOT NULL,
  status text NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'verified')),
  final_grade text,
  doctor_notes text,
  verified_by uuid,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX screenings_status_created_idx ON public.screenings (status, created_at DESC);
CREATE INDEX screenings_created_by_idx ON public.screenings (created_by);
GRANT SELECT, INSERT, UPDATE ON public.screenings TO authenticated;
GRANT ALL ON public.screenings TO service_role;
ALTER TABLE public.screenings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kiosk users can create screenings"
ON public.screenings FOR INSERT TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Owners and doctors can view screenings"
ON public.screenings FOR SELECT TO authenticated
USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Doctors can verify screenings"
ON public.screenings FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'doctor'))
WITH CHECK (public.has_role(auth.uid(), 'doctor'));

ALTER TABLE public.screenings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.screenings;

CREATE POLICY "Users upload fundus scans to their own folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'fundus-scans' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Owners and doctors can view fundus scans"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'fundus-scans'
  AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(), 'doctor'))
);