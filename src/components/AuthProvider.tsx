import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore, useCreditsStore } from "@/lib/store";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setSession, setLoading, fetchProfile } = useAuthStore();
  const { fetchCredits } = useCreditsStore();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
            fetchCredits(session.user.id);
          }, 0);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchCredits(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setSession, setLoading, fetchProfile, fetchCredits]);

  return <>{children}</>;
};

export default AuthProvider;
