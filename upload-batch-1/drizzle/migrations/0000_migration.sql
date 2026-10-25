CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT 'Player',
  avatar text NOT NULL DEFAULT '🧠',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are publicly readable" ON public.profiles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, left(coalesce(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1), 'Player'), 30))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.daily_scores (
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  game text NOT NULL,
  day date NOT NULL,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100000),
  ms integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, game, day)
);
CREATE INDEX daily_scores_board ON public.daily_scores (game, day, score DESC, ms ASC);
GRANT SELECT ON public.daily_scores TO anon;
GRANT SELECT, INSERT, UPDATE ON public.daily_scores TO authenticated;
GRANT ALL ON public.daily_scores TO service_role;
ALTER TABLE public.daily_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Scores are publicly readable" ON public.daily_scores FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users insert own scores" ON public.daily_scores FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own scores" ON public.daily_scores FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.submit_daily_score(_game text, _day date, _score integer, _ms integer)
RETURNS void LANGUAGE sql SECURITY INVOKER SET search_path = public AS $$
  INSERT INTO public.daily_scores (user_id, game, day, score, ms)
  VALUES (auth.uid(), _game, _day, _score, _ms)
  ON CONFLICT (user_id, game, day) DO UPDATE
    SET score = EXCLUDED.score, ms = EXCLUDED.ms, updated_at = now()
    WHERE EXCLUDED.score > daily_scores.score
       OR (EXCLUDED.score = daily_scores.score AND EXCLUDED.ms < daily_scores.ms);
$$;
REVOKE EXECUTE ON FUNCTION public.submit_daily_score(text, date, integer, integer) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.submit_daily_score(text, date, integer, integer) TO authenticated;